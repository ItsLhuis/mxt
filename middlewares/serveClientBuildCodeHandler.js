const path = require("path")

const serveClientBuildCodeHandler = (req, res, next) => {
  if (!req.originalUrl.startsWith("/api/")) {
    return res.sendFile(path.join(__dirname, "..", "public", "client", "build", "index.html"))
  }
  next()
}

module.exports = serveClientBuildCodeHandler
