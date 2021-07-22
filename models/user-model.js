const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  active: {
    // 是否啟用，點完連結即啟用
    type: Boolean,
    default: false,
  },
  activeCode: {
    // 啟用碼，會跟在router後面做驗證
    type: String,
  },
  activeTimeLimit: {
    type: Date,
  },

  // Common data
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    // 帳號建立日期
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    //頭貼，儲存照片imgur網址
    //google註冊的話就是其他它內建網址
    type: String,
    default: "https://i.imgur.com/zdyARhC.png",
  },
  loveArticle: {
    // 儲存喜歡文章的ID的array
    type: [String],
  },
  post: {
    // 發表評論ID的array
    type: [String],
  },
  write: {
    // 發表文章權限
    type: Boolean,
    default: false,
  },
  level: {
    // 棋力
    type: Number,
  },
  intro: {
    // 自介
    type: String,
    default: "我很懶，什麼都沒留下...",
  },
  //   only for google login
  googleID: {
    type: String,
  },
})

module.exports = mongoose.model("User", userSchema)
