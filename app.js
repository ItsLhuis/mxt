require("dotenv").config()

const express = require("express")
const http = require("http")
const cors = require("cors")
const helmet = require("helmet")
const session = require("express-session")
const bodyParser = require("body-parser")
const crypto = require("crypto")
const path = require("path")

const serveClientBuildCodeHandler = require("@middlewares/serveClientBuildCodeHandler")
const notFoundHandler = require("@middlewares/notFoundHandler")
const errorHandler = require("@middlewares/errorHandler")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(helmet())
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true)
    },
    credentials: true
  })
)

app.use(express.json())

const secretKey = process.env.SESSION_SECRET
  ? crypto.randomBytes(64).toString("hex")
  : crypto.createHash("sha256").update(process.env.SESSION_SECRET).digest("hex")

app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      httpOnly: false
    }
  })
)

app.use(express.static(path.join(__dirname, "public/client/build")))
app.use(serveClientBuildCodeHandler)

const apiV1Routes = require("@api/v1")
app.use("/api/v1", apiV1Routes)

app.use(notFoundHandler)
app.use(errorHandler)

const server = http.createServer(app)

module.exports = { server }
