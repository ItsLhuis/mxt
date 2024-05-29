const fs = require("fs")
const path = require("path")

exports.tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next)
  } catch (error) {
    const deleteFile = (filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {})
      }
    }

    if (req.file) {
      deleteFile(req.file.path)
    }

    if (req.files) {
      req.files.forEach((file) => deleteFile(file.path))
    }

    return next(error)
  }
}
