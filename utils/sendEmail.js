const fs = require("fs")
const path = require("path")

const formData = require("form-data")
const Mailgun = require("mailgun.js")
const mailgun = new Mailgun(formData)

const generateEmailHtml = require("@utils/emailMjmlToHtml")

const sendEmail = (companyName, to, subject, text, data, template) => {
  return new Promise((resolve, reject) => {
    const emailTemplatePath = path.join(__dirname, "../", "templates/emails", `${template}.mjml`)
    const mjmlTemplate = fs.readFileSync(emailTemplatePath, "utf-8")

    const emailHtml = generateEmailHtml(mjmlTemplate, data)

    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY
    })

    const mailOptions = {
      from: `"${companyName}" <mailgun@sandbox4c598ca6ba214b6b89e34d4024aea70d.mailgun.org>`,
      to,
      subject,
      text: text,
      html: emailHtml
    }

    mg.messages
      .create("sandbox4c598ca6ba214b6b89e34d4024aea70d.mailgun.org", mailOptions)
      .then((msg) => {
        resolve(msg)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = sendEmail
