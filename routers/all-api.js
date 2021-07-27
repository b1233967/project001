const router = require("express").Router()
const Article = require("../models/article-model")
const User = require("../models/user-model")

router.get("/", (req, res) => {
  res.send("API page")
})

router.get("/hello", (req, res) => {
  res.send("HELLO")
})

// 收藏數計算
router.get("/computelikes/:id/:num", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  let { id, num } = req.params
  let articleID = id
  let articleLikesNum = num
  Article.findOneAndUpdate(
    { _id: articleID },
    { likes: articleLikesNum },
    (err, data) => {
      if (err) {
        console.log(err)
        res.json({ status: "Likes failed" })
      }
      if (data) {
        // console.log(data)
        res.json({ status: "Likes success" })
      }
    }
  )
})

// 確認登入狀態
router.post("/isLoggedin", (req, res) => {
  console.log(req.user)
  res.header("Access-Control-Allow-Origin", "*")
  if (req.isAuthenticated()) {
    console.log("Login")
    return res.json({ isLoggedin: true })
  } else {
    console.log("not login")
    return res.json({ isLoggedin: false })
  }
})

// 加入收藏
router.post("/addLikesToUser/:articleID", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  let { articleID } = req.params
  let userid = req.user._id
  // console.log("I am in addLikesToUser now .")
  // console.log(req.user, articleID)
  console.log(articleID)
  await User.findByIdAndUpdate(userid, {
    $push: { loveArticle: [articleID] },
  })
  res.json({ likes: "success" })
})
// 移除收藏
router.post("/rmLikesFromUser/:articleID", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  let { articleID } = req.params
  let userid = req.user._id
  let current_user = await User.findOne({ _id: userid })
  let loveArticleList = current_user.loveArticle
  let articleIdx = loveArticleList.indexOf(articleID)
  // console.log("The article index is " + articleIdx)
  // console.log("Before loveArticleList = " + loveArticleList)
  loveArticleList.splice(articleIdx, 1)
  // console.log("After loveArticleList = " + loveArticleList)
  await User.findByIdAndUpdate(
    userid,
    { loveArticle: loveArticleList },
    (err, data) => {
      if (err) {
        console.log(err)
        res.json({ rmLikes: "failed" })
      }
      if (data) {
        console.log("Remove Likes success")
        res.json({ rmLikes: "success" })
      }
    }
  )
})

module.exports = router
