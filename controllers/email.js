const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const formatPhoneNumber = require("@utils/formatPhoneNumber")

const { EMAIL_NOT_FOUND } = require("@constants/errors/shared/email")
const { CLIENT_NOT_FOUND, CONTACT_NOT_FOUND, INVALID_CONTACT } = require("@constants/errors/client")

const Email = require("@models/email")

const Client = require("@models/client")

const { upload, checkTotalFileSize } = require("@middlewares/uploadFileHandler")

const emailController = {
  addAttachments: [
    upload.multiple("attachments", Infinity, []),
    checkTotalFileSize(40 * 1024 * 1024)
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
  send: tryCatch(async (req, res) => {
    const { clientId, contactId, subject, title, message, text } = req.body

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
