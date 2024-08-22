require("dotenv").config()

const express = require("express")
const cookieParser = require("cookie-parser")
const http = require("http")
const cors = require("cors")
const helmet = require("helmet")
const path = require("path")

const serveClientBuildCodeHandler = require("@middlewares/serveClientBuildCodeHandler")
const notFoundHandler = require("@middlewares/notFoundHandler")
const errorHandler = require("@middlewares/errorHandler")
const emptyStringHandler = require("@middlewares/emptyStringHandler")

const initializeApp = require("@utils/initializeApp")

const app = express()

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.use(cookieParser())

const getDomainList = () => {
  const domains =
    process.env.NODE_ENV === "development"
      ? process.env.DEVELOPMENT_DOMAINS.split(",")
      : process.env.PRODUCTION_DOMAINS.split(",")

  return domains.filter(Boolean)
}

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "blob:", "https://flagcdn.com", ...getDomainList()],
        "script-src": ["'self'", "https:", ...getDomainList()],
        "style-src": ["'self'", "https:", "'unsafe-inline'", ...getDomainList()],
        "connect-src": ["'self'", "https:", "wss:", ...getDomainList()],
        "default-src": ["'self'", ...getDomainList()],
        "frame-src": ["'self'", ...getDomainList()],
        "frame-ancestors": ["'self'", ...getDomainList()]
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "sameorigin" },
    hidePoweredBy: true,
    hsts: {
      maxAge: 15552000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    xssFilter: true,
    crossOriginEmbedderPolicy: { policy: "credentialless" },
    crossOriginOpenerPolicy: { policy: "same-origin" }
  })
)

app.use(
  cors({
    origin: getDomainList(),
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
