const fs = require("fs")
const path = require("path")

const { PassThrough } = require("stream")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const processImage = require("@utils/processImage")

const { IMAGE_NOT_FOUND, IMAGE_STREAMING_ERROR } = require("@constants/errors/shared/image")

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

      res.setHeader("Content-Type", "image/jpeg")

      const readStream = new PassThrough()

      const processedImageBuffer = await processImage(imagePath, options)

      readStream.end(processedImageBuffer)
      readStream.pipe(res)

      readStream.on("error", () => {
        throw new AppError(
          500,
          IMAGE_STREAMING_ERROR,
          "Image streaming error",
          false,
          IMAGE_ERROR_TYPE
        )
      })

      readStream.on("end", () => {
        res.end()
      })
    } else {
      throw new AppError(404, IMAGE_NOT_FOUND, "Image not found", false, IMAGE_ERROR_TYPE)
    }
  })
}

module.exports = imageController
