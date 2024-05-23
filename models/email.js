const AppError = require("@classes/app/error")

const { EMAIL_SEND_ERROR } = require("@constants/errors/shared/email")

const { EMAIL_ERROR_TYPE } = require("@constants/errors/shared/types")

const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const mailer = require("@utils/mailer")

const Client = require("@models/client")
const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const Email = {
  findAll: withCache("emails", async () => {
    const emailsQuery = "SELECT * FROM emails"
    const emails = await dbQueryExecutor.execute(emailsQuery)

    const emailsWithDetails = await Promise.all(
      emails.map(async (email) => {
        const [client, sentByUser] = await Promise.all([
          Client.findByClientId(email.client_id),
          User.findByUserId(email.sent_by_user_id)
        ])

        return {
          id: email.id,
          api_id: email.api_id,
          client:
            client.length > 0
              ? { id: client[0].id, name: client[0].name, description: client[0].description }
              : null,
          subject: email.subject,
          sent_by_user: sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
          created_at_datetime: email.created_at_datetime
        }
      })
    )

    return emailsWithDetails
  }),
  findByEmailId: (emailId) =>
    withCache(
      `email:${emailId}`,
      async () => {
        const emailQuery = "SELECT * FROM emails WHERE id = ?"
        const email = await dbQueryExecutor.execute(emailQuery, [emailId])

        if (!email || email.length <= 0) {
          return []
        }

        const apiId = email[0].api_id
        let emailResendData = {}

        try {
          emailResendData = await mailer.get(apiId)
        } catch (error) {
          console.error("Error fetching email details from Resend:", error)
        }

        const [client, sentByUser] = await Promise.all([
          Client.findByClientId(email[0].client_id),
          User.findByUserId(email[0].sent_by_user_id)
        ])

        const emailWithDetails = {
          id: email[0].id,
          api_id: email[0].api_id,
          from: emailResendData.from,
          client:
            client || client.length > 0
              ? { id: client[0].id, name: client[0].name, description: client[0].description }
              : null,
          to: emailResendData.to[0],
          subject: email[0].subject,
          html: emailResendData.html,
          text: emailResendData.text,
          status: emailResendData.last_event,
          sent_by_user: sentByUser || sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
          created_at_datetime: email[0].created_at_datetime,
          sent_at_datetime: email[0].created_at_datetime
        }

        return [emailWithDetails]
      },
      memoryOnlyCache
    )(),
  send: (
    clientId,
    companyLogo,
    companyName,
    companyAddress,
    companyCity,
    companyCountry,
    contact,
    title,
    subject,
    message,
    text,
    sentByUserId
  ) => {
    return new Promise((resolve, reject) => {
      mailer
        .send(companyName, contact, subject, text, {
          companyLogo,
          title,
          message,
          footer: "Por motivos de segurança, recomendamos o não compartilhamento desta mensagem!",
          companyName,
          companyAddress,
          companyCity,
          companyCountry
        })
        .then((data) => {
          const query =
            "INSERT INTO emails (api_id, client_id, subject, sent_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, NOW())"
          return dbQueryExecutor.execute(query, [data.id, clientId, subject, sentByUserId])
        })
        .then((result) => {
          return revalidateCache("emails").then(() => resolve(result))
        })
        .catch(() => {
          reject(
            new AppError(500, EMAIL_SEND_ERROR, "Failed to send e-mail", false, EMAIL_ERROR_TYPE)
          )
        })
    })
  }
}

module.exports = Email
