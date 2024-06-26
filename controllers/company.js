const fs = require("fs")
const path = require("path")

const { PassThrough } = require("stream")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const processImage = require("@utils/processImage")

const { COMPANY_LOGO_IS_REQUIRED } = require("@constants/errors/company")
const { IMAGE_NOT_FOUND, IMAGE_STREAMING_ERROR } = require("@constants/errors/shared/image")

const { IMAGE_ERROR_TYPE } = require("@constants/errors/shared/types")

const Company = require("@models/company")
const { companySchema } = require("@schemas/company")

const upload = require("@middlewares/uploadFileHandler")

const companyController = {
  uploadLogo: upload.single("logo"),
  find: tryCatch(async (req, res) => {
    const company = await Company.find()
    res.status(200).json(company)
  }),
  findLogo: tryCatch(async (req, res) => {
    const { size, quality, blur } = req.query

    const companyLogo = await Company.findLogo()

    if (companyLogo.length <= 0 || !companyLogo[0].logo) {
      throw new AppError(404, IMAGE_NOT_FOUND, "Company logo not found", false, IMAGE_ERROR_TYPE)
    }

    const options = {
      size: parseInt(size),
      quality: quality || "high",
      blur: blur ? parseInt(blur) : false
    }

    res.setHeader("Content-Type", companyLogo[0].logo_mime_type)

    const readStream = new PassThrough()

    const processedImageBuffer = await processImage(Buffer.from(companyLogo[0].logo), options)

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
  }),
  update: tryCatch(async (req, res) => {
    const { name, address, city, locality, country, postalCode, phoneNumber, email } = req.body

    companySchema.parse(req.body)

    await Company.update(name, address, city, locality, country, postalCode, phoneNumber, email)

    if (req.file) {
      await Company.updateLogo(req.file.buffer, req.file.mimetype, req.file.size)
    } else {
      throw new AppError(400, COMPANY_LOGO_IS_REQUIRED, "Company logo is required", false)
    }

    res.status(204).json({ message: "Company updated successfully" })
  })
}

module.exports = companyController
