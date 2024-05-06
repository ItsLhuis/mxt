require("dotenv").config()

const express = require("express")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const http = require("http")
const cors = require("cors")
const helmet = require("helmet")
const bodyParser = require("body-parser")
const path = require("path")

const serveClientBuildCodeHandler = require("@middlewares/serveClientBuildCodeHandler")
const notFoundHandler = require("@middlewares/notFoundHandler")
const errorHandler = require("@middlewares/errorHandler")
const emptyStringHandler = require("@middlewares/emptyStringHandler")

const initializeBossUser = require("@utils/initializeBossUser")

// const isProduction = process.env.NODE_ENV === "production"

const app = express()

/* if (isProduction) {
  app.set("trust proxy", 1)
} */

app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: {
      sameSite: "none",
      secure: /* isProduction */ false,
      httpOnly: true,
      maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000
    }
  })
)

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

app.use(express.static(path.join(__dirname, "public/client/build")))
app.use(serveClientBuildCodeHandler)

const apiV1Routes = require("@api/v1")
app.use("/api/v1", emptyStringHandler, apiV1Routes)

app.use(notFoundHandler)
app.use(errorHandler)

initializeBossUser()

const server = http.createServer(app)

module.exports = { server }
