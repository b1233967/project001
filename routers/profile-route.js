const router = require("express").Router()
const Article = require("../models/article-model")
const User = require("../models/user-model")

// middleware
const authCheck = (req, res, next) => {
  req.session.returnTo = req.originalUrl
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login")
  } else {
    next()
  }
}

router.get("/", authCheck, async (req, res) => {
  // console.log(req.user)

  let userId = req.user._id
  let curUser = await User.findById(userId)
  let userLoveArticles = curUser.loveArticle
  let articleList = await Article.find(
    { _id: { $in: userLoveArticles } },
    (err, data) => {
      if (err) console.log(err)
      if (data) console.log("Success")
    }
  )
  res.render("profile", {
    area: "My favorite",
    articleList,
    user: req.user,
    userLoveArticles,
  })
})

module.exports = router
