const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { SMS_NOT_FOUND } = require("@constants/errors/shared/sms")

const Sms = require("@models/sms")

const smsController = {
  findAll: tryCatch(async (req, res) => {
    const smses = await Sms.findAll()
    res.status(200).json(smses)
  }),
  findBySmsId: tryCatch(async (req, res) => {
    const { smsId } = req.params

    const existingSms = await Sms.findBySmsId(smsId)
    if (existingSms.length <= 0) {
      throw new AppError(404, SMS_NOT_FOUND, "Sms not found", true)
    }

    res.status(200).json(existingSms)
  })
}

module.exports = smsController
