const multer = require("multer")
const { v4: uuidv4 } = require("uuid")
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { INVALID_IMAGE_FORMAT } = require("@constants/errors/shared/image")

const { IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const getFileExtension = (fileName) => {
  return path.extname(fileName).toLowerCase()
}

const storage = (fileType) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
      const fileId = uuidv4()

      let extension = ""

      if (fileType === "image") {
        const fileExtension = getFileExtension(file.originalname)
        if (!IMAGE_EXTENSIONS.includes(fileExtension)) {
          return cb(
            new AppError(
              400,
              INVALID_IMAGE_FORMAT,
              `Invalid image format. Only ${IMAGE_EXTENSIONS.join(", ")} files are allowed`,
              undefined,
              IMAGE_ERROR_TYPE
            )
          )
        }
        extension = fileExtension
      }

      const fileName = `${fileId}${extension}`

      cb(null, fileName)
    }
  })
}

const multerUploadImage = multer({
  storage: storage("image"),
  limits: { fileSize: MAX_IMAGE_SIZE }
})

const uploadImage = {
  single: (fieldName) =>
    tryCatch(async (req, res, next) => {
      multerUploadImage.single(fieldName)(req, res, async (err) => {
        if (err) {
          return next(err)
        }

        try {
          const outputFileName = `${uuidv4()}.${req.file.originalname.split(".").pop()}`
          const outputPath = `uploads/${outputFileName}`

          const metadata = await sharp(req.file.path).metadata()

          const targetWidth = metadata.width >= 1400 ? 1400 : metadata.width

          await sharp(req.file.path)
            .resize({ width: targetWidth })
            .jpeg({ quality: 90 })
            .toFile(outputPath)
            .then(() => {
              fs.unlinkSync(req.file.path)
            })

          req.file.filename = outputFileName
          req.file.path = outputPath

          next()
        } catch (error) {
          return next(error)
        }
      })
    })
}

module.exports = { upload: { image: uploadImage } }
