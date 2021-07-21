const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  mainPic: {
    // 儲存縮圖的imgur網址
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  intro: {
    // 儲存簡介文字
    type: String,
    required: true,
  },
  likes: {
    // 被收藏數
    type: Number,
    default: 0,
  },
  content: {
    // 文章本文內容的html
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Article", articleSchema)
