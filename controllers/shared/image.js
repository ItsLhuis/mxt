const fs = require("fs")
const path = require("path")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { IMAGE_NOT_FOUND } = require("@constants/errors/shared/image")

const imageController = {
  sendImage: tryCatch((req, res) => {
    const { imageName } = req.params

    const imagePath = path.join(__dirname, "../../", "uploads/", imageName)

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath)
    } else {
      throw new AppError(404, IMAGE_NOT_FOUND, "Image not found", true, "Image")
    }
  })
}

module.exports = imageController
