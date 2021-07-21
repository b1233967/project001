const router = require("express").Router()

const ejs = require("ejs")
const kuromoji = require("kuromoji")
const { json } = require("body-parser")
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const { window } = new JSDOM("")
const $ = require("jquery")(window)
const DIC_URL = "node_modules/kuromoji/dict"

$(".word").click(function () {
  $(this).css("background-color", "red")
})

router.get("/", (req, res) => {
  res.render("jpTeacher", { result: null })
})

router.post("/", async (req, res) => {
  let { article } = req.body
  // console.log(article);
  let result = await translate(article)
  // console.log(result);
  res.render("jpTeacher", { result })
})

// try api
router.get("/getword/:word", async (req, res) => {
  let word = req.params.word
  // console.log(word)
  let json_p = await translate(word)
  res.json(json_p)
})

function translate(sentence) {
  const words = new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: DIC_URL }).build((err, tokenizer) => {
      if (err) {
        return reject(err)
      }
      resolve(tokenizer.tokenize(sentence))
    })
  })
  //   console.log(words) ;
  return words
}

module.exports = router
