const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { SMS_NOT_FOUND } = require("@constants/errors/shared/sms")

const { CLIENT_NOT_FOUND, CONTACT_NOT_FOUND, INVALID_CONTACT } = require("@constants/errors/client")

const Sms = require("@models/sms")

const Client = require("@models/client")

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
  }),
  send: tryCatch(async (req, res) => {
    const { clientId, contactId, message } = req.body

    const existingClient = await Client.findByClientId(clientId)
    if (existingClient.length <= 0) {
      throw new AppError(400, CLIENT_NOT_FOUND, "Client not found", true)
    }

    const existingContact = await Client.contact.findByContactId(contactId)
    if (existingContact.length <= 0) {
      throw new AppError(400, CONTACT_NOT_FOUND, "Contact not found", true)
    }

    if (existingContact[0].client_id !== Number(clientId)) {
      throw new AppError(400, CONTACT_NOT_FOUND, "Contact not found", true)
    }

    if (existingContact[0].type === "E-mail" || existingContact[0].type === "Outro") {
      throw new AppError(400, INVALID_CONTACT, "Invalid contact", true)
    }

    await Sms.send(clientId, existingContact[0].contact, message, req.user.id)
    res.status(201).json({ message: "Sms sent successfully" })
  })
}

module.exports = smsController
