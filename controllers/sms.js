const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { SMS_NOT_FOUND } = require("@constants/errors/shared/sms")
const { CLIENT_NOT_FOUND, CONTACT_NOT_FOUND, INVALID_CONTACT } = require("@constants/errors/client")
const { ACTIVITY_YEAR_NOT_PROVIDED } = require("@constants/errors/shared/analytics")

const adjustPaginationParams = require("@utils/adjustPaginationParams")

const Sms = require("@models/sms")
const { smsSchema } = require("@schemas/sms")

const Client = require("@models/client")

const smsController = {
  findAll: tryCatch(async (req, res) => {
    adjustPaginationParams(req)

    const { page, limit, searchTerm, filterBy, sortBy, sortOrder } = req.query

    const smses = await Sms.findAll(page, limit, searchTerm, filterBy, sortBy, sortOrder)
    res.status(200).json(smses)
  }),
  findBySmsId: tryCatch(async (req, res) => {
    const { smsId } = req.params

    const existingSms = await Sms.findBySmsId(smsId)
    if (existingSms.length <= 0) {
      throw new AppError(404, SMS_NOT_FOUND, "Sms not found", true)
    }

    res.status(200).json(existingSms)
  }),
  analytics: {
    summary: tryCatch(async (req, res) => {
      const total = await Sms.analytics.getTotal()
      const lastMonthsTotal = await Sms.analytics.getLastSixCompleteMonthsTotal()
      const lastMonthsPercentageChange =
        await Sms.analytics.getLastTwoCompleteMonthsPercentageChange()

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

      const totalsByMonthForYear = await Sms.analytics.getTotalsByMonthForYear(year)
      const totalForYear = totalsByMonthForYear.reduce((acc, monthData) => acc + monthData.total, 0)

      res.status(200).json({
        year: year,
        total_for_year: totalForYear,
        totals_by_month_for_year: totalsByMonthForYear
      })
    })
  },
  send: tryCatch(async (req, res) => {
    const { clientId, contactId, message } = req.body

    smsSchema.parse(req.body)

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

    if (existingContact[0].type === "E-mail" || existingContact[0].type === "Outro") {
      throw new AppError(400, INVALID_CONTACT, "Invalid contact", true)
    }

    await Sms.send(clientId, existingContact[0].contact, message, req.user.id)
    res.status(201).json({ message: "Sms sent successfully" })
  })
}

module.exports = smsController
