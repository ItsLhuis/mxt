const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { NON_INITIALIZED_COMPANY } = require("@constants/errors/company")

const Company = require("@models/company")

const checkCompany = tryCatch(async (req, res, next) => {
  const company = await Company.find()
  const companyLogo = await Company.findLogo()

  if (company.length <= 0 || !companyLogo[0].logo) {
    throw new AppError(
      400,
      NON_INITIALIZED_COMPANY,
      "Company information is invalid or missing",
      true
    )
  }

  const { name, address, city, country, postal_code, phone_number, email } = company[0]

  if (!name || !address || !city || !country || !postal_code || !phone_number || !email) {
    throw new AppError(
      400,
      NON_INITIALIZED_COMPANY,
      "Company information is invalid or missing",
      true
    )
  }

  req.company = {
    name,
    address,
    city,
    country,
    postalCode: postal_code,
    phoneNumber: phone_number,
    email
  }

  next()
})

module.exports = checkCompany
