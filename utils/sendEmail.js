const fs = require("fs")
const path = require("path")

const generateEmailHtml = require("@utils/emailMjmlToHtml")
const transporter = require("@config/email")

const sendEmail = async (companyName, to, subject, data, template) => {
  const emailTemplatePath = path.join(__dirname, "../", "templates/emails", `${template}.mjml`)
  const mjmlTemplate = fs.readFileSync(emailTemplatePath, "utf-8")

  const emailHtml = generateEmailHtml(mjmlTemplate, data)

  const mailOptions = {
    from: `"${companyName}" <${process.env.EMAIL_EMAIL}>`,
    to,
    subject,
    html: emailHtml
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
