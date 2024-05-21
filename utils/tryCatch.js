const fs = require("fs")

exports.tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next)
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {})
    }

    return next(error)
  }
}
