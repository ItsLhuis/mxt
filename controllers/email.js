const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const formatPhoneNumber = require("@utils/formatPhoneNumber")

const { EMAIL_NOT_FOUND } = require("@constants/errors/shared/email")
const { CLIENT_NOT_FOUND, CONTACT_NOT_FOUND, INVALID_CONTACT } = require("@constants/errors/client")
const { ACTIVITY_YEAR_NOT_PROVIDED } = require("@constants/errors/shared/analytics")

const Email = require("@models/email")
const { emailSchema } = require("@schemas/email")

const Client = require("@models/client")

const { upload, checkTotalFileSize } = require("@middlewares/uploadFileHandler")

const emailController = {
  addAttachments: [
    upload.multiple("attachments", Infinity, []),
    checkTotalFileSize(20 * 1024 * 1024)
  ],
  findAll: tryCatch(async (req, res) => {
    const emails = await Email.findAll()
    res.status(200).json(emails)
  }),
  findByEmailId: tryCatch(async (req, res) => {
    const { emailId } = req.params

    const existingEmail = await Email.findByEmailId(emailId)
    if (existingEmail.length <= 0) {
      throw new AppError(404, EMAIL_NOT_FOUND, "E-mail not found", true)
    }

    res.status(200).json(existingEmail)
  }),
  analytics: {
    summary: tryCatch(async (req, res) => {
      const total = await Email.analytics.getTotal()
      const lastMonthsTotal = await Email.analytics.getLastTwoCompleteMonthsTotal()
      const lastMonthsPercentageChange =
        await Email.analytics.getLastTwoCompleteMonthsPercentageChange()

      res.status(200).json({
        total: total[0]["total"],
        last_months_total: lastMonthsTotal,
        percentage_change_last_two_months: lastMonthsPercentageChange
      })
    }),
    activity: tryCatch(async (req, res) => {
      let { year } = req.params

      if (!year) {
        throw new AppError(400, ACTIVITY_YEAR_NOT_PROVIDED, "Year is required", true)
      }

      year = Number(year)

      if (
        isNaN(year) ||
        year.toString().length !== 4 ||
        year < 1900 ||
        year > new Date().getFullYear()
      ) {
        throw new AppError(400, ACTIVITY_YEAR_NOT_PROVIDED, "Invalid year provided", true)
      }

      const totalsByMonthForYear = await Email.analytics.getTotalsByMonthForYear(year)
      const totalForYear = totalsByMonthForYear.reduce((acc, monthData) => acc + monthData.total, 0)

      res.status(200).json({
        year: year,
        total_for_year: totalForYear,
        totals_by_month_for_year: totalsByMonthForYear
      })
    })
  },
  send: tryCatch(async (req, res) => {
    const { clientId, contactId, subject, title, message, text } = req.body

    emailSchema.parse({ ...req.body, clientId: Number(clientId), contactId: Number(contactId) })

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(404, CLIENT_NOT_FOUND, "Client not found", true)
    }

    const existingContact = await Client.contact.findByContactId(contactId)
    if (existingContact.length <= 0) {
      throw new AppError(404, CONTACT_NOT_FOUND, "Contact not found", true)
    }

    if (existingContact[0].client_id !== Number(clientId)) {
      throw new AppError(404, CONTACT_NOT_FOUND, "Contact not found", true)
    }

    if (existingContact[0].type !== "E-mail") {
      throw new AppError(400, INVALID_CONTACT, "Invalid contact", true)
    }

    const { name, address, city, country, postalCode, phoneNumber, email, website } = req.company

    const attachments = req.files || []

    await Email.send(
      clientId,
      name,
      `${address}, ${postalCode}`,
      city,
      country,
      formatPhoneNumber(phoneNumber),
      email,
      website,
      existingContact[0].contact,
      title,
      subject,
      message,
      text,
      attachments,
      req.user.id
    )
    res.status(201).json({ message: "E-mail sent successfully" })
  })
}

module.exports = emailController
