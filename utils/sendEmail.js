const fs = require("fs")
const path = require("path")

const { Resend } = require("resend")
const resend = new Resend(process.env.RESEND_API_KEY)

const generateEmailHtml = require("@utils/emailMjmlToHtml")

const sendEmail = (companyName, to, subject, text, data, template) => {
  return new Promise((resolve, reject) => {
    const emailTemplatePath = path.join(__dirname, "../", "templates/emails", `${template}.mjml`)
    const mjmlTemplate = fs.readFileSync(emailTemplatePath, "utf-8")

    const emailHtml = generateEmailHtml(mjmlTemplate, data)

    const mailOptions = {
      from: `"${companyName}" <onboarding@resend.dev>`,
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

module.exports = sendEmail
