const path = require("path")

module.exports = function serveClientBuildCode(req, res, next) {
  if (!req.originalUrl.startsWith("/api/")) {
    return res.sendFile(path.join(__dirname, "../public/client/build", "index.html"))
  }
  next()
}
