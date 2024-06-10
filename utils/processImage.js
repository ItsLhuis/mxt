const sharp = require("sharp")
sharp.cache(false)

const AppError = require("@classes/app/error")

const { IMAGE_PROCESSING_ERROR } = require("@constants/errors/shared/image")

const { IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const processImage = async (imagePath, { size, quality, blur } = {}) => {
  try {
    const imageInfo = await sharp(imagePath).metadata()

    const options = {
      size: size || imageInfo.width || 800,
      quality: Number(quality) || 90,
      blur: blur || 0
    }

    if (options.size > 1400) {
      options.size = 1400
    }

    const image = sharp(imagePath)

    if (options.size) {
      image.resize(options.size)
    }

    if (options.quality < 0 || options.quality > 100) {
      options.quality = 90
    }

    if (imageInfo.format === "png") {
      image.png({ quality: options.quality, force: false })
    } else {
      image.jpeg({ quality: options.quality })
    }

    if (options.blur < 0) {
      options.blur = 0
    } else if (options.blur > 100) {
      options.blur = 100
    }

    if (options.blur) {
      image.blur(options.blur)
    }

    const processedImageBuffer = await image.toBuffer()

    return processedImageBuffer
  } catch (error) {
    throw new AppError(
      500,
      IMAGE_PROCESSING_ERROR,
      "Error processing image",
      false,
      IMAGE_ERROR_TYPE
    )
  }
}

module.exports = processImage
