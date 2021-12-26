const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { config } = require("dotenv")
config()
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")

const mongoURL = process.env.MONGO_URL
const PORT = 4000

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected!")
  })
  .catch((err) => {
    console.log(err)
    console.log("DB Connection Failure!")
  })

app.use(express.json())

app.use("/server/auth", authRoute)
app.use("/server/users", userRoute)

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
})
