const path = require("path")

const multer = require("multer")
const sharp = require("sharp")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const {
  INVALID_ATTACHMENT_FORMAT,
  MAX_TOTAL_FILE_SIZE_EXCEEDED
} = require("@constants/errors/shared/attachment")
const { INVALID_IMAGE_FORMAT } = require("@constants/errors/shared/image")

const { ATTACHMENT_ERROR_TYPE, IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const VALID_ATTACHMENT_EXTENSIONS = [".jpeg", ".jpg", ".png", ".pdf"]
const VALID_IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png"]

const memoryStorage = multer.memoryStorage()

const normalizeFileName = (fileName) => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.-]/g, "")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase())
}

const processFile = async (file) => {
  const extension = path.extname(file.originalname).toLowerCase()
  const normalizedOriginalFileName = normalizeFileName(file.originalname)

  if (VALID_IMAGE_EXTENSIONS.includes(extension)) {
    const imageInfo = await sharp(file.buffer).metadata()
    const originalWidth = imageInfo.width

    let targetWidth = 1400
    if (originalWidth <= 1400) {
      targetWidth = originalWidth
    }

    if (extension === ".png") {
      file.buffer = await sharp(file.buffer)
        .resize({ width: targetWidth })
        .png({ quality: 90, force: false })
        .toBuffer()
    } else {
      file.buffer = await sharp(file.buffer)
        .resize({ width: targetWidth })
        .jpeg({ quality: 90 })
        .toBuffer()
    }
  }

  file.originalname = normalizedOriginalFileName
  file.size = file.buffer.length
}

const fileFilter = (validExtensions) => (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase()

  if (!validExtensions.includes(extension)) {
    cb(
      new AppError(
        400,
        validExtensions === VALID_IMAGE_EXTENSIONS
          ? INVALID_IMAGE_FORMAT
          : INVALID_ATTACHMENT_FORMAT,
        `Invalid file format. Only ${validExtensions.join(", ")} files are allowed`,
        false,
        validExtensions === VALID_IMAGE_EXTENSIONS ? IMAGE_ERROR_TYPE : ATTACHMENT_ERROR_TYPE
      )
    )
  } else {
    cb(null, true)
  }
}

const checkTotalFileSize = (maxTotalSize) => (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next()
  }

  const totalSize = req.files.reduce((acc, file) => acc + file.size, 0)

  if (totalSize > maxTotalSize) {
    return next(
      new AppError(
        400,
        MAX_TOTAL_FILE_SIZE_EXCEEDED,
        `Total file size exceeds ${maxTotalSize} bytes`,
        false,
        ATTACHMENT_ERROR_TYPE
      )
    )
  }

  next()
}

const upload = {
  single: (fieldName, validExtensions = VALID_ATTACHMENT_EXTENSIONS) =>
    tryCatch(async (req, res, next) => {
      let multerOptions = {
        storage: memoryStorage,
        limits: { fileSize: 5 * 1024 * 1024 }
      }

      if (validExtensions && validExtensions.length > 0) {
        multerOptions.fileFilter = fileFilter(validExtensions)
      }

      const upload = multer(multerOptions).single(fieldName)

      upload(req, res, async (err) => {
        if (err) return next(err)

        if (req.file) {
          try {
            await processFile(req.file)
            next()
          } catch (error) {
            next(error)
          }
        } else {
          next()
        }
      })
    }),
  multiple: (fieldName, maxCount, validExtensions = VALID_ATTACHMENT_EXTENSIONS) =>
    tryCatch(async (req, res, next) => {
      let multerOptions = {
        storage: memoryStorage,
        limits: { fileSize: 5 * 1024 * 1024 }
      }

      if (validExtensions && validExtensions.length > 0) {
        multerOptions.fileFilter = fileFilter(validExtensions)
      }

      const upload = multer(multerOptions).array(fieldName, maxCount)

      upload(req, res, async (err) => {
        if (err) return next(err)

        if (req.files && req.files.length > 0) {
          try {
            await Promise.all(req.files.map(processFile))
            next()
          } catch (error) {
            next(error)
          }
        } else {
          next()
        }
      })
    })
}

module.exports = {
  VALID_ATTACHMENT_EXTENSIONS,
  VALID_IMAGE_EXTENSIONS,
  checkTotalFileSize,
  upload
}
