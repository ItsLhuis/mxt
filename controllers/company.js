const fs = require("fs")
const path = require("path")

const { PassThrough } = require("stream")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const processImage = require("@utils/processImage")

const { IMAGE_NOT_FOUND, IMAGE_STREAMING_ERROR } = require("@constants/errors/shared/image")

const { IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const Company = require("@models/company")
const { companySchema } = require("@schemas/company")

const upload = require("@middlewares/uploadFileHandler")

const companyController = {
  uploadLogo: upload.image.public.single("logo"),
  find: tryCatch(async (req, res) => {
    const company = await Company.find()
    res.status(200).json(company)
  }),
  findLogo: tryCatch(async (req, res) => {
    const { size, quality, blur } = req.query

    const imagePath = path.join(__dirname, "..", "uploads", req.company.logo)

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
  }),
  update: tryCatch(async (req, res) => {
    const { name, address, city, country, postalCode, phoneNumber, email } = req.body

    companySchema.parse(req.body)

    const company = await Company.find()

    let logo
    if (req.file) {
      logo = req.file.filename
    } else {
      logo = company[0].logo
    }

    await Company.update(name, address, city, country, postalCode, phoneNumber, email, logo)

    if (req.file && company[0].logo) {
      const oldLogoPath = path.join(__dirname, "..", "uploads", company[0].logo)
      upload.deleteFile(oldLogoPath)
    }
    res.status(204).json({ message: "Company updated successfully" })
  })
}

module.exports = companyController
