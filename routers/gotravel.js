const router = require("express").Router()
const Article = require("../models/article-model")
const User = require("../models/user-model")

// middleware
const setOriUrl = (req, res, next) => {
  req.session.returnTo = req.originalUrl
  next()
}

// 東京地區
const tokyoArea = ["tokyo"]

// 關東地區
const kantoArea = [
  "nagano",
  "tochigi",
  "kanagawa",
  "saitama",
  "chiba",
  "gunma",
  "ibaraki",
]

// 關西地區
const kansaiArea = ["kyoto", "osaka", "mie", "nara", "shiga", "wakayama"]

// 中國/四國地方
const chugokuArea = [
  "okayama",
  "hiroshima",
  "shimane",
  "totori",
  "yamakuchi",
  "ehime",
  "kagawa",
  "kouchi",
  "tokushima",
]

const otherArea = [
  "akita",
  "aomori",
  "hukushima",
  "iwate",
  "miyagi",
  "yamagata",
  "okinawa",
  "hokkaido",
  "aichi",
  "hukui",
  "gihu",
  "ishikawa",
  "niigata",
  "shizuoka",
  "toyama",
  "yamanashi",
  "hukuoka",
  "kagoshima",
  "kumamoto",
  "miyazaki",
  "nagasaki",
  "ooita",
  "saga",
]

router.get("/", setOriUrl, (req, res) => {
  res.render("go_travel", { user: req.user })
})

router.get("/:inputCountyArea", setOriUrl, async (req, res) => {
  let { inputCountyArea } = req.params
  let countyArea = getCataArea(inputCountyArea)
  let articleList = await Article.find(
    { area: { $in: countyArea } },
    (err, data) => {
      if (err) console.log(err)
      if (data) console.log("Success")
    }
  )
  if (req.isAuthenticated()) {
    let userId = req.user._id
    let curUser = await User.findById(userId)
    let userLoveArticles = curUser.loveArticle
    res.render("article-overview", {
      area: inputCountyArea,
      articleList,
      user: req.user,
      userLoveArticles,
    })
  } else {
    res.render("article-overview", {
      area: inputCountyArea,
      articleList,
      user: req.user,
    })
  }
})

// 依縣市名取得區域名稱
function getCataArea(area) {
  if (area == "tokyo") {
    return tokyoArea
  }
  if (area == "kanto") {
    return kantoArea
  }
  if (area == "kansai") {
    return kansaiArea
  }
  if (area == "chugoku") {
    return chugokuArea
  }
  if (area == "other") {
    return otherArea
  }
}

module.exports = router
