const { v4: uuidv4 } = require("uuid")

const multer = require("multer")
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const PUBLIC_UPLOADS_FOLDER = "uploads"
const PRIVATE_UPLOADS_FOLDER = "uploads/private"

const { INVALID_ATTACHMENT_FORMAT } = require("@constants/errors/shared/attachment")

const { INVALID_IMAGE_FORMAT } = require("@constants/errors/shared/image")

const { ATTACHMENT_ERROR_TYPE, IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const memoryStorage = multer.memoryStorage()

const VALID_ATTACHMENT_EXTENSIONS = [".jpeg", ".jpg", ".png", ".pdf"]

const multerUploadAttachment = multer({
  storage: memoryStorage
})

const isValidAttachmentExtension = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase()
  return VALID_ATTACHMENT_EXTENSIONS.includes("." + extension)
}

const uploadAttachment = (outputDir) => ({
  multiple: (fieldName, maxCount) =>
    tryCatch(async (req, res, next) => {
      multerUploadAttachment.array(fieldName, maxCount)(req, res, async (err) => {
        if (err) {
          return next(err)
        }

        if (!req.files || req.files.length === 0) {
          return next()
        }

        try {
          for (const file of req.files) {
            if (!isValidAttachmentExtension(file.originalname)) {
              throw new AppError(
                400,
                INVALID_ATTACHMENT_FORMAT,
                `Invalid file format. Only ${VALID_ATTACHMENT_EXTENSIONS.join(
                  ", "
                )} files are allowed`,
                false,
                ATTACHMENT_ERROR_TYPE
              )
            }

            const outputFileName = `${uuidv4()}${path.extname(file.originalname)}`
            const outputPath = path.join(outputDir, outputFileName)

            file.filename = outputFileName
            file.path = outputPath
          }

          req.file.buffer = null

          next()
        } catch (error) {
          return next(error)
        }
      })
    })
})

const VALID_IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const multerUploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_IMAGE_SIZE }
})

const isValidImageExtension = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase()
  return VALID_IMAGE_EXTENSIONS.includes("." + extension)
}

const uploadImage = (outputDir) => ({
  single: (fieldName) =>
    tryCatch(async (req, res, next) => {
      multerUploadImage.single(fieldName)(req, res, async (err) => {
        if (err) {
          return next(err)
        }

        if (!req.file) {
          return next()
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
          const outputPath = path.join(outputDir, outputFileName)

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
})

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, () => {})
  }
}

const createUploadsFolderIfNotExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
}

createUploadsFolderIfNotExists(PUBLIC_UPLOADS_FOLDER)
createUploadsFolderIfNotExists(PRIVATE_UPLOADS_FOLDER)

const upload = {
  image: {
    public: uploadImage(PUBLIC_UPLOADS_FOLDER),
    private: uploadImage(PRIVATE_UPLOADS_FOLDER)
  },
  attachment: {
    public: uploadAttachment(PUBLIC_UPLOADS_FOLDER),
    private: uploadAttachment(PRIVATE_UPLOADS_FOLDER)
  },
  deleteFile
}

module.exports = upload
