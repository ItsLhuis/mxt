const AppError = require("@classes/app/error")

const { SMS_SEND_ERROR } = require("@constants/errors/shared/sms")

const { SMS_ERROR_TYPE } = require("@constants/errors/shared/types")

const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const ReleansClient = require("@classes/releans")
const releans = new ReleansClient(process.env.RELEANS_API_KEY)

const convertTimeZone = require("@utils/convertTimeZone ")

const Client = require("@models/client")
const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const Sms = {
  findAll: withCache("smses", async () => {
    const smsesQuery = "SELECT * FROM smses ORDER BY created_at_datetime DESC"
    const smses = await dbQueryExecutor.execute(smsesQuery)

    const smsesWithDetails = await Promise.all(
      smses.map(async (sms) => {
        const [client, sentByUser] = await Promise.all([
          Client.findByClientId(sms.client_id),
          User.findByUserId(sms.sent_by_user_id)
        ])

        return {
          id: sms.id,
          api_id: sms.api_id,
          client:
            client.length > 0
              ? { id: client[0].id, name: client[0].name, description: client[0].description }
              : null,
          to: sms.contact,
          message: sms.message,
          sent_by_user: sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
          created_at_datetime: sms.created_at_datetime
        }
      })
    )

    return smsesWithDetails
  }),
  findBySmsId: (smsId) =>
    withCache(
      `sms:${smsId}`,
      async () => {
        const smsQuery = "SELECT * FROM smses WHERE id = ?"
        const sms = await dbQueryExecutor.execute(smsQuery, [smsId])

        if (!sms || sms.length <= 0) {
          return []
        }

        const apiId = sms[0].api_id
        let smsReleansData = { from: null, status: null }

        try {
          smsReleansData = await releans.get(apiId)
        } catch (error) {}

        const convertReleansTimeZone = convertTimeZone(
          smsReleansData.date_sent,
          smsReleansData.timezone
        )

        const lowerCaseStatus = smsReleansData.status.toLowerCase()

        const statusText = (() => {
          switch (lowerCaseStatus) {
            case "delivered":
              return "Entregue"
            case "failed":
              return "Erro ao Enviar"
            case "undelivered":
              return "Rejeitado"
            case "sent":
              return "Enviado"
            case "queued":
              return "Na Fila"
            default:
              return "Desconhecido"
          }
        })()

        const statusColor = (() => {
          switch (lowerCaseStatus) {
            case "Delivered":
              return "success"
            case "Failed":
            case "Undelivered":
              return "error"
            case "Sent":
            case "Queued":
              return "info"
            default:
              return "default"
          }
        })()

        const [client, sentByUser] = await Promise.all([
          Client.findByClientId(sms[0].client_id),
          User.findByUserId(sms[0].sent_by_user_id)
        ])

        const smsWithDetails = {
          id: sms[0].id,
          api_id: sms[0].api_id,
          from: smsReleansData.from,
          client:
            client || client.length > 0
              ? { id: client[0].id, name: client[0].name, description: client[0].description }
              : null,
          to: sms[0].contact,
          message: sms[0].message,
          status: {
            name: statusText,
            color: statusColor
          },
          sent_by_user: sentByUser || sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
          created_at_datetime: sms[0].created_at_datetime,
          sent_at_datetime: convertReleansTimeZone
        }

        return [smsWithDetails]
      },
      memoryOnlyCache
    )(),
  send: (clientId, contact, message, sentByUserId) => {
    return new Promise((resolve, reject) => {
      releans
        .send(process.env.RELEANS_SENDER_ID, contact, message)
        .then((data) => {
          const query =
            "INSERT INTO smses (api_id, client_id, contact, message, sent_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
          return dbQueryExecutor.execute(query, [data.id, clientId, contact, message, sentByUserId])
        })
        .then((result) => {
          return revalidateCache("smses").then(() => resolve(result))
        })
        .catch(() => {
          reject(new AppError(500, SMS_SEND_ERROR, "Failed to send Sms", false, SMS_ERROR_TYPE))
        })
    })
  }
}

module.exports = Sms
