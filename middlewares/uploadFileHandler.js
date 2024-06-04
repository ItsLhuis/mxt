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

const processFile = async (file, outputDir) => {
  const extension = path.extname(file.originalname).toLowerCase()
  const outputFileName = `${uuidv4()}${extension}`
  const outputPath = path.join(outputDir, outputFileName)

  if ([".jpeg", ".jpg", ".png"].includes(extension)) {
    const imageInfo = await sharp(file.buffer).metadata()
    const originalWidth = imageInfo.width

    let targetWidth = 1400
    if (originalWidth <= 1400) {
      targetWidth = originalWidth
    }

    if (extension === ".png") {
      await sharp(file.buffer)
        .resize({ width: targetWidth })
        .png({ quality: 90, force: false })
        .toFile(outputPath)
    } else {
      await sharp(file.buffer)
        .resize({ width: targetWidth })
        .jpeg({ quality: 90 })
        .toFile(outputPath)
    }
  } else if (extension === ".pdf") {
    await new Promise((resolve, reject) => {
      fs.writeFile(outputPath, file.buffer, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  return {
    filename: outputFileName,
    path: outputPath
  }
}

const memoryStorage = multer.memoryStorage()

const multerUploadAttachment = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const VALID_ATTACHMENT_EXTENSIONS = [".jpeg", ".jpg", ".png", ".pdf"]
    const extension = path.extname(file.originalname).toLowerCase()

    if (!VALID_ATTACHMENT_EXTENSIONS.includes(extension)) {
      cb(
        new AppError(
          400,
          INVALID_ATTACHMENT_FORMAT,
          `Invalid file format. Only ${VALID_ATTACHMENT_EXTENSIONS.join(", ")} files are allowed`,
          false,
          ATTACHMENT_ERROR_TYPE
        )
      )
    } else {
      cb(null, true)
    }
  }
})

const multerUploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const VALID_IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png"]
    const extension = path.extname(file.originalname).toLowerCase()

    if (!VALID_IMAGE_EXTENSIONS.includes(extension)) {
      cb(
        new AppError(
          400,
          INVALID_IMAGE_FORMAT,
          `Invalid image format. Only ${VALID_IMAGE_EXTENSIONS.join(", ")} files are allowed`,
          false,
          IMAGE_ERROR_TYPE
        )
      )
    } else {
      cb(null, true)
    }
  }
})

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

        console.log(req.files)

        try {
          for (const file of req.files) {
            const processedFile = await processFile(file, outputDir)

            file.filename = processedFile.filename
            file.path = processedFile.path
          }

          req.files.forEach((file) => (file.buffer = null))

          next()
        } catch (error) {
          return next(error)
        }
      })
    })
})

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
          const processedFile = await processFile(req.file, outputDir)

          req.file.filename = processedFile.filename
          req.file.path = processedFile.path

          req.file.buffer = null

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
    public: uploadImage(PUBLIC_UPLOADS_FOLDER)
  },
  attachment: {
    private: uploadAttachment(PRIVATE_UPLOADS_FOLDER)
  },
  deleteFile
}

module.exports = upload
