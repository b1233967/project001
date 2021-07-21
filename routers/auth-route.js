// 處理任何和認證有關的程序

const router = require("express").Router()
const passport = require("passport")
const bcrypt = require("bcrypt")
const User = require("../models/user-model")

router.get("/", (req, res) => {
  res.redirect("/auth/login")
})

router.get("/login", (req, res) => {
  // console.log(req.originalUrl)
  res.render("login")
})

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "信箱或密碼錯誤",
    //會自動傳到 flash 的 res.locals.error 中
  }),
  (req, res) => {
    if (req.session.returnTo) {
      let newPath = req.session.returnTo
      req.session.returnTo = ""
      res.redirect(newPath)
    } else {
      res.redirect("/profile")
    }
  }
)

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
)
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  let newPath = req.session.returnTo
  req.session.returnTo = ""
  res.redirect(newPath)
})

router.get("/logout", (req, res) => {
  req.logOut()
  if (req.session.returnTo) {
    let newPath = req.session.returnTo
    req.session.returnTo = ""
    res.redirect(newPath)
  } else {
    res.redirect("/")
  }
})

router.get("/register", (req, res) => {
  res.render("register", { user: req.user })
})

router.post("/register", async (req, res) => {
  // After register , if not use google then I want to send confirm mail.
  let { username, email, password } = req.body
  // 確認username和email是否被使用
  let nameExist = await User.findOne({ username })
  if (nameExist) {
    req.flash("error_msg", "撞名了，換一個吧~")
    req.flash("old_username", username)
    req.flash("old_email", email)
    res.redirect("/auth/register")
  } else {
    let emailExist = await User.findOne({ email })
    if (emailExist) {
      req.flash("error_msg", "這個信箱用過囉~")
      req.flash("old_username", username)
      req.flash("old_email", email)
      res.redirect("/auth/register")
    } else {
      const hash = await bcrypt.hash(password, 10)
      password = hash
      let newUser = new User({ username, email, password })
      try {
        await newUser.save()
        req.flash("success_msg", "註冊成功 歡迎登入")
        res.redirect("/auth/login")
      } catch (err) {
        req.flash("error_msg", err.errors.name.properties.message)
        res.redirect("/auth/register")
      }
    }
  }
  res.send(
    "After register , if not use google then I want to send confirm mail."
  )
})

module.exports = router
