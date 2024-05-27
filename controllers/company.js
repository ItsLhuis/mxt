const path = require("path")

const { tryCatch } = require("@utils/tryCatch")

const Company = require("@models/company")
const { companySchema } = require("@schemas/company")

const upload = require("@middlewares/uploadFileHandler")

const companyController = {
  uploadLogo: upload.image.public.single("logo"),
  find: tryCatch(async (req, res) => {
    const company = await Company.find()
    res.status(200).json(company)
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
      const oldLogoPath = path.join("uploads", company[0].logo)
      upload.deleteFile(oldLogoPath)
    }
    res.status(204).json({ message: "Company updated successfully" })
  })
}

module.exports = companyController
