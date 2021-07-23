const express = require("express")
const app = express()
const ejs = express("ejs")
const dotenv = require("dotenv")
dotenv.config()
const passport = require("passport")
const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./config/passport")
const multer = require("multer")
const multiparty = require("connect-multiparty")
const MultipartyMiddleware = multiparty({ uploadDir: "./tempIMG" })
const formData = require("form-data")
const imgur = require("imgur")
const nodemailer = require("nodemailer")
const Port = "80"

// routers
const authRoute = require("./routers/auth-route")
const goTravel = require("./routers/gotravel")
const goInternational = require("./routers/gointernational")
const jpTeacher = require("./routers/jpTeacher")
const profile_route = require("./routers/profile-route")
const article = require("./routers/article-route")
const API = require("./routers/all-api")

// middleware
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.old_username = req.flash("old_username")
  res.locals.old_email = req.flash("old_email")
  res.locals.notActive_msg = req.flash("notActive_msg")
  next()
})
const setOriUrl = (req, res, next) => {
  req.session.returnTo = req.originalUrl
  next()
}

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongodb atlas")
  })
  .catch((e) => {
    console.log(e)
  })

// for jp teacher
/** 文字列内のカタカナをひらがなに変換します。 */
app.locals.kataToHira = function kataToHira(str) {
  return str.replace(/[\u30A1-\u30FA]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  )
}

app.use("/auth", authRoute)
app.use("/gotravel", goTravel)
app.use("/gointernational", goInternational)
app.use("/jpteacher", jpTeacher)
app.use("/profile", profile_route)
app.use("/article", article)
app.use("/api", API)

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/about", setOriUrl, (req, res) => {
  res.render("about", { user: req.user })
})

app.get("/*", (req, res) => {
  res.redirect("/")
})

app.listen(Port, () => {
  console.log(`Server is running on port ${Port} .`)
})
