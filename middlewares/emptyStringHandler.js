const handleEmptyString = require("@utils/handleEmptyString")

const emptyString = (req, res, next) => {
  if (!req.body) {
    return next()
  }

  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      req.body[key] = handleEmptyString(req.body[key])
    }
  }

  next()
}

module.exports = emptyString
