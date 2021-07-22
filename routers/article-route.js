const router = require("express").Router()
const path = require("path")
const fs = require("fs")
// const axios = require("axios")
const formData = require("form-data")
const multiparty = require("connect-multiparty")
const MultipartyMiddleware = multiparty({
  uploadDir: path.join(__dirname, "./tempIMG"),
})
const imgur = require("imgur")
const Article = require("../models/article-model")
const User = require("../models/user-model")

// middleware
const setOriUrl = (req, res, next) => {
  req.session.returnTo = req.originalUrl
  next()
}
const authCheck = (req, res, next) => {
  req.session.returnTo = req.originalUrl
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login")
  } else {
    next()
  }
}

router.get("/", setOriUrl, async (req, res) => {
  let articleList = await Article.find({}, (err, data) => {
    if (err) console.log(err)
    if (data) console.log("Success")
  })
  if (req.isAuthenticated()) {
    let userId = req.user._id
    let curUser = await User.findById(userId)
    let userLoveArticles = curUser.loveArticle
    res.render("article-overview", {
      area: "全文章列表",
      articleList,
      user: req.user,
      userLoveArticles,
    })
  } else {
    res.render("article-overview", {
      area: "全文章列表",
      articleList,
      user: req.user,
    })
  }
})

router.get("/edit", authCheck, (req, res) => {
  let writable = req.user.write
  if (writable) {
    res.render("article_edit")
  } else if (req.user) {
    res.redirect("/profile")
  } else {
    res.redirect("/auth/login")
  }
})

router.post("/edit", MultipartyMiddleware, async (req, res) => {
  const filePath = req.files.mainPic.path
  const imgurLink = await getImgurLink(filePath) // 縮圖的imgur網址
  let { title, area, intro, content } = req.body
  // console.log(req.body)
  let newArticle = new Article({
    title,
    mainPic: imgurLink,
    area,
    intro,
    content,
  })
  try {
    await newArticle.save()
    let articleID = newArticle._id
    res.redirect(`/article/${articleID}`)
    // res.send("文章儲存成功")
  } catch (err) {
    console.log(error)
    res.redirect("/article/edit")
  }
})

// 把上傳的圖片丟到imgur圖床上
router.post("/changePicApi", MultipartyMiddleware, async (req, res) => {
  let tempFile = req.files.upload
  let tempFilePath = tempFile.path
  let targetPath //傳到imgur後的連結
  if (
    path.extname(tempFile.originalFilename).toLowerCase === ".png" ||
    ".jpg" ||
    "jpeg"
  ) {
    targetPath = await getImgurLink(tempFilePath)
    res.status(200).json({ uploaded: "true", url: targetPath })
  }
})

router.get("/:id", setOriUrl, async (req, res) => {
  let articleID = req.params.id
  let user = req.user
  let alreadyLike = false
  if (typeof user != "undefined" && user.loveArticle.indexOf(articleID) != -1) {
    alreadyLike = true
  }
  let article = await Article.findOne({ _id: articleID })
  res.render("article", { article, user, alreadyLike })
})

async function getImgurLink(tempFilePath) {
  let resultLink
  await imgur
    .uploadFile(tempFilePath)
    .then((json) => {
      resultLink = json.link
      fs.unlink(tempFilePath, (err) => {
        if (err) throw err
        console.log("Temp file has been deleted.")
      })
    })
    .catch((err) => {
      console.error(err.message)
    })
  return resultLink
}

module.exports = router
