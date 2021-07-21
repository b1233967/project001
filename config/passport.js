const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
const User = require("../models/user-model")
const localStrategy = require("passport-local")
const bcrypt = require("bcrypt")
// passport的三大賞賜
// 1. req.user => user資訊/資料
// 2. req.logOut() => 將使用者登出
// 3. req.isAuthenticated() => 確認送req來的用戶是否為經過認證的

passport.serializeUser((user, done) => {
  console.log("Serializing user now")
  done(null, user._id)
})

passport.deserializeUser((_id, done) => {
  console.log("Deserialize user now")
  User.findById({ _id }).then((user) => {
    console.log("Found user .")
    done(null, user)
  })
})

passport.use(
  new localStrategy((username, password, done) => {
    // console.log(username, password)
    User.findOne({ email: username })
      .then(async (user) => {
        if (!user) {
          return done(null, false)
        }
        await bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return done(null, false)
          }
          if (!result) {
            return done(null, false)
          } else {
            return done(null, user)
          }
        })
      })
      .catch((err) => {
        console.log(err)
        return done(null, false)
      })
  })
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback
      console.log(profile)
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          console.log("This user is already existed.")
          done(null, foundUser)
        } else {
          new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New user created.")
              done(null, newUser)
            })
        }
      })
    }
  )
)
