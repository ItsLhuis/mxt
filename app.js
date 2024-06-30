require("dotenv").config()

const express = require("express")
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

const initializeApp = require("@utils/initializeApp")

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(helmet())
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "blob:", "https://flagcdn.com"]
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
)
app.use(
  cors({
    origin: [
      process.env.NODE_ENV === "development" && process.env.DEVELOPMENT_DOMAIN,
      process.env.PRODUCTION_DOMAIN
    ].filter(Boolean),
    credentials: true
  })
)

app.use(express.static(path.join(__dirname, "public/client/build")))
app.use(serveClientBuildCodeHandler)

const apiV1Routes = require("@app/api/v1")
app.use("/api/v1", emptyStringHandler, apiV1Routes)

app.use(notFoundHandler)
app.use(errorHandler)

initializeApp()

const server = http.createServer(app)

module.exports = { server }
