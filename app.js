require("dotenv").config()

const express = require("express")
const http = require("http")
const cors = require("cors")
const helmet = require("helmet")
const session = require("express-session")
const bodyParser = require("body-parser")
const crypto = require("crypto")
const path = require("path")

const serveClientBuildCodeMiddleware = require("@middlewares/serveClientBuildCode")

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

app.use(
  session({
    secret: crypto.randomBytes(64).toString("hex"),
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

const apiV1Routes = require("@api/v1")
app.use("/api/v1", apiV1Routes)

app.use(serveClientBuildCodeMiddleware)

const server = http.createServer(app)

module.exports = { server }
