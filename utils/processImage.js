const sharp = require("sharp")

const AppError = require("@classes/app/error")

const { IMAGE_PROCESSING } = require("@constants/errors/shared/image")

const { IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const processImage = async (imagePath, options) => {
  try {
    const imageInfo = await sharp(imagePath).metadata()

    const defaultOptions = {
      size: imageInfo.width || 800,
      quality: "high",
      format: "jpeg",
      blur: false
    }

    const mergedOptions = { ...defaultOptions, ...options }

    if (!["high", "medium", "low"].includes(mergedOptions.quality)) {
      mergedOptions.quality = "high"
    }

    if (mergedOptions.size > 2000) {
      mergedOptions.size = 2000
    }

    const imageBuffer = await sharp(imagePath).toBuffer()

    let resizedImageBuffer
    if (mergedOptions.size) {
      resizedImageBuffer = await sharp(imageBuffer).resize(mergedOptions.size).toBuffer()
    } else {
      resizedImageBuffer = await sharp(imageBuffer)
        .resize({
          width: mergedOptions.width,
          height: mergedOptions.height
        })
        .toBuffer()
    }

    let processedImageBuffer
    if (mergedOptions.quality === "high") {
      processedImageBuffer = await sharp(resizedImageBuffer).jpeg({ quality: 90 }).toBuffer()
    } else if (mergedOptions.quality === "low") {
      processedImageBuffer = await sharp(resizedImageBuffer).jpeg({ quality: 50 }).toBuffer()
    } else if (mergedOptions.quality === "medium") {
      processedImageBuffer = await sharp(resizedImageBuffer).jpeg({ quality: 75 }).toBuffer()
    }

    let blurredImageBuffer
    if (mergedOptions.blur === true) {
      blurredImageBuffer = await sharp(processedImageBuffer).blur(10).toBuffer()
    } else if (typeof mergedOptions.blur === "number" && mergedOptions.blur > 0) {
      blurredImageBuffer = await sharp(processedImageBuffer).blur(mergedOptions.blur).toBuffer()
    } else {
      blurredImageBuffer = processedImageBuffer
    }

    let finalImageBuffer
    if (mergedOptions.format !== "jpeg") {
      finalImageBuffer = await sharp(blurredImageBuffer).toFormat(mergedOptions.format).toBuffer()
    } else {
      finalImageBuffer = blurredImageBuffer
    }

    return finalImageBuffer
  } catch (error) {
    throw new AppError(500, IMAGE_PROCESSING, "Error processing image", true, IMAGE_ERROR_TYPE)
  }
}

module.exports = processImage
