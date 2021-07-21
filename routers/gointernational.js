const router = require("express").Router()

// middleware
const setOriUrl = (req, res, next) => {
  req.session.returnTo = req.originalUrl
  next()
}

router.get("/", setOriUrl, (req, res) => {
  res.render("go_international", { user: req.user })
})

module.exports = router
