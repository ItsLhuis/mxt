const initializeUser = (req, res, next) => {
  if (!req.user || typeof req.user !== "object") {
    req.user = {}
  }
  next()
}

module.exports = initializeUser
