const fs = require("fs")
const path = require("path")

const processImage = require("@utils/processImage")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { IMAGE_NOT_FOUND } = require("@constants/errors/shared/image")

const { IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const imageController = {
  sendImage: tryCatch(async (req, res) => {
    const { imageName } = req.params

    const { size, quality, blur } = req.query

    const imagePath = path.join(__dirname, "../../", "uploads/", imageName)

    if (fs.existsSync(imagePath)) {
      const options = {
        size: parseInt(size),
        quality: quality || "high",
        blur: blur ? parseInt(blur) : false
      }

      const processedImageBuffer = await processImage(imagePath, options)

      res.setHeader("Content-Type", "image/jpeg")
      res.end(processedImageBuffer, "binary")
    } else {
      throw new AppError(404, IMAGE_NOT_FOUND, "Image not found", true, IMAGE_ERROR_TYPE)
    }
  })
}

module.exports = imageController
