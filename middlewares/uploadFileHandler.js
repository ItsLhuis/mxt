const { v4: uuidv4 } = require("uuid")
const multer = require("multer")
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { INVALID_IMAGE_FORMAT } = require("@constants/errors/shared/image")

const { IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const VALID_IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const memoryStorage = multer.memoryStorage()

const multerUploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_IMAGE_SIZE }
})

const isValidImageExtension = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase()
  return VALID_IMAGE_EXTENSIONS.includes("." + extension)
}

const uploadImage = {
  single: (fieldName) =>
    tryCatch(async (req, res, next) => {
      multerUploadImage.single(fieldName)(req, res, async (err) => {
        if (err) {
          return next(err)
        }

        try {
          if (!isValidImageExtension(req.file.originalname)) {
            throw new AppError(
              400,
              INVALID_IMAGE_FORMAT,
              `Invalid image format. Only ${VALID_IMAGE_EXTENSIONS.join(", ")} files are allowed`,
              false,
              IMAGE_ERROR_TYPE
            )
          }

          const outputFileName = `${uuidv4()}${path.extname(req.file.originalname)}`
          const outputPath = `uploads/${outputFileName}`

          const targetWidth = 1400

          await sharp(req.file.buffer)
            .resize({ width: targetWidth })
            .jpeg({ quality: 90 })
            .toFile(outputPath)

          req.file.buffer = null

          req.file.filename = outputFileName
          req.file.path = outputPath

          next()
        } catch (error) {
          return next(error)
        }
      })
    })
}

const createUploadsFolderIfNotExists = () => {
  const UPLOADS_FOLDER = "uploads"

  if (!fs.existsSync(UPLOADS_FOLDER)) {
    fs.mkdirSync(UPLOADS_FOLDER)
  }
}

createUploadsFolderIfNotExists()

module.exports = { upload: { image: uploadImage } }
