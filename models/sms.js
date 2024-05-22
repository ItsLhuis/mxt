const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const ReleansClient = require("@classes/releans")
const releans = new ReleansClient(process.env.RELEANS_API_KEY)

const moment = require("moment-timezone")

const Client = require("@models/client")
const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const Sms = {
  findAll: withCache("smses", async () => {
    const query = "SELECT * FROM smses"
    const smsList = await dbQueryExecutor.execute(query)

    const detailedSmsList = await Promise.all(
      smsList.map(async (sms) => {
        const client = await Client.findByClientId(sms.client_id)
        const sentByUser = await User.findByUserId(sms.sent_by_user_id)

        return {
          id: sms.id,
          api_id: sms.api_id,
          client:
            client.length > 0
              ? { id: client[0].id, name: client[0].name, description: client[0].description }
              : null,
          message: sms.message,
          sent_by_user: sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
          created_at_datetime: sms.created_at_datetime
        }
      })
    )

    return detailedSmsList
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
        let smsReleansData = {}

        try {
          smsReleansData = await releans.get(apiId)
        } catch (error) {
          console.error("Error fetching SMS details from Releans:", error)
        }

        const convertTimeZone = moment
          .tz(smsReleansData.date_sent, "YYYY-MM-DD HH:mm:ss a", smsReleansData.timezone)
          .tz("Europe/Lisbon")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")

        const client = await Client.findByClientId(sms[0].client_id)
        const sentByUser = await User.findByUserId(sms[0].sent_by_user_id)

        const smsWithDetails = {
          id: sms[0].id,
          api_id: sms[0].api_id,
          from: smsReleansData.from,
          client:
            client || client.length > 0
              ? { id: client[0].id, name: client[0].name, description: client[0].description }
              : null,
          to: smsReleansData.to,
          message: sms[0].message,
          status: smsReleansData.status,
          sent_by_user: sentByUser || sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
          created_at_datetime: sms[0].created_at_datetime,
          sent_at_datetime: convertTimeZone
        }

        return [smsWithDetails]
      },
      memoryOnlyCache
    )(),
  create: (apiId, clientId, message, sentByUserId) => {
    const query =
      "INSERT INTO smses (api_id, client_id, message, sent_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, NOW())"
    return dbQueryExecutor
      .execute(query, [apiId, clientId, message, sentByUserId])
      .then((result) => {
        return revalidateCache("smses").then(() => result)
      })
  }
}

module.exports = Sms
