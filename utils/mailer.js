const fs = require("fs")
const path = require("path")

const { Resend } = require("resend")
const resend = new Resend(process.env.RESEND_API_KEY)

const generateEmailHtml = require("@utils/emailMjmlToHtml")

const sendEmail = (companyName, to, subject, text, data, template) => {
  return new Promise((resolve, reject) => {
    const emailTemplatePath = path.join(
      __dirname,
      "..",
      "templates",
      "emails",
      `${template ? template : "default"}.mjml`
    )
    const mjmlTemplate = fs.readFileSync(emailTemplatePath, "utf-8")

    const emailHtml = generateEmailHtml(mjmlTemplate, data)

    const mailOptions = {
      from: `${companyName} <${process.env.RESEND_DOMAIN}>`,
      to,
      subject,
      text: text,
      html: emailHtml
    }

    resend.emails
      .send(mailOptions)
      .then((msg) => {
        if (msg.error) {
          reject(msg.error)
        }
        resolve(msg.data)
      })
      .catch((error) => reject(error))
  })
}

const getEmail = (id) => {
  return new Promise((resolve, reject) => {
    resend.emails
      .get(id)
      .then((msg) => {
        if (msg.error) {
          reject(msg.error)
        }
        resolve(msg.data)
      })
      .catch((error) => reject(error))
  })
}

const email = {
  send: sendEmail,
  get: getEmail
}

module.exports = email
