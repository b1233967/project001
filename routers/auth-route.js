// 處理任何和認證有關的程序

const router = require("express").Router()
const passport = require("passport")
const bcrypt = require("bcrypt")
const User = require("../models/user-model")
const nodemailer = require("nodemailer")
const webAddress = "http://localhost:3000/"

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
  async (req, res) => {
    if (!req.user.active) {
      let curUser = req.user
      let activeCode = getActiveCode()
      console.log(`before findbyid activeCode = ${activeCode}`)
      req.logOut()
      req.flash("notActive_msg", "您的帳號尚未驗證")
      await User.findOneAndUpdate({ _id: curUser._id }, { activeCode })
      // 發送驗證信，內有驗證連結，需在十分鐘內點擊
      sendVerifyMail(curUser.email, curUser._id, curUser.username, activeCode)
      console.log(`After findbyid activeCode = ${activeCode}`)
      res.redirect(`/auth/resend/${curUser._id}`)
    } else if (req.session.returnTo) {
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
  let { username, email, password, pwCheck } = req.body
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
    } else if (password != pwCheck) {
      req.flash("error_msg", "密碼不一致")
      req.flash("old_username", username)
      req.flash("old_email", email)
      res.redirect("/auth/register")
    } else {
      // 先創建user資料，但啟用先是false,點完連結才會true
      const hash = await bcrypt.hash(password, 10)
      password = hash
      const activeCode = getActiveCode() // 驗證碼
      let newUser = new User({ username, email, password, activeCode })
      try {
        await newUser.save()
        // 發送驗證信，內有驗證連結，需在十分鐘內點擊
        sendVerifyMail(email, newUser._id, username, activeCode)
        // res.send("提醒user點擊驗證信頁面")
        res.redirect(`/auth/resend/${newUser._id}`)
      } catch (err) {
        console.log(err)
        req.flash("error_msg", err.errors.name.properties.message)
        res.redirect("/auth/register")
      }
    }
  }
})

router.get("/resend/:userId", async (req, res) => {
  const activeCode = getActiveCode()
  const { userId } = req.params
  let curUser = await User.findOne({ _id: userId })
  if (curUser.active) {
    if (req.session.returnTo) {
      let newPath = req.session.returnTo
      req.session.returnTo = ""
      res.redirect(newPath)
    } else {
      req.flash("success_msg", "驗證成功 歡迎登入")
      res.redirect("/auth/login")
    }
  } else {
    console.log("curUser")
    res.render("waitingMail")
  }
})

// 驗證連結router
router.get("/:userID/:activeCode", async (req, res) => {
  let { userID, activeCode } = req.params
  let curUser = await User.findOneAndUpdate(
    { _id: userID, activeCode },
    { active: true },
    (err, data) => {
      if (err) throw err
      if (data) console.log(data)
    }
  )
  console.log(curUser)
  console.log("I am checking")
  if (curUser) {
    req.flash("success_msg", "註冊成功 歡迎登入")
    res.redirect("/auth/login")
  } else {
    req.flash("notActive_msg", "您的帳號尚未驗證")
    // 發送驗證信，內有驗證連結，需在十分鐘內點擊
    sendVerifyMail(curUser.email, curUser._id, curUser.name, activeCode)
    res.redirect(`/auth/resend/${userID}`)
  }
})

function getActiveCode() {
  // 生成一個 8 碼全數字序號當作驗證碼
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

// 發送驗證信
function sendVerifyMail(userMail, userId, username, activeCode) {
  let verifyAddress = webAddress + "auth" + "/" + userId + "/" + activeCode
  const mailTransporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MYMAIL,
      pass: process.env.MYMAILPW,
    },
  })
  const mailOption = {
    from: process.env.MYMAIL,
    to: userMail, // 註冊者的信箱
    subject: "Go community 信箱驗證",
    html: getVerifyMailContent(verifyAddress, username),
  }
  mailTransporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log("Send failed , Error")
      return "error"
    }
    if (info) {
      consoel.log("Send success")
      return "success"
    }
  })
}

function getVerifyMailContent(verifyAddress, username) {
  return `<p style="font-weight:bold">Hi,${username}</p>
          <p>歡迎光臨 Go Community，以下為驗證連結，進入連結後即註冊成功</p>
          <p>驗證連結：<a href="${verifyAddress}">${verifyAddress}</a></p>
          <p>祝您玩得愉快~</p>`
}

module.exports = router
