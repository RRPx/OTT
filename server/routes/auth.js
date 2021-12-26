const { Router } = require("express")
const app = Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

// User Registration -> a POST method
app.post("/register", async ({ body }, res) => {
  const { username, email, password, age } = body
  const newUser = new User({
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString(),
    age,
  })

  try {
    const user = await newUser.save()
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})

// LOGIN -> a POST method
app.post("/login", async ({ body }, res) => {
  const { email, password } = body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json("Wrong Username!")
    const pass = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
    const originalPassword = pass.toString(CryptoJS.enc.Utf8)
    if (originalPassword !== body.password)
      // issue-1
      return res.status(401).json("User is valid but password is wrong!")

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    )

    const { password, ...others } = user._doc
    res.status(200).json({ ...others, accessToken })
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = app
