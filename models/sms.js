const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const ReleansClient = require("@classes/releans")
const releans = new ReleansClient(process.env.RELEANS_API_KEY)

const moment = require("moment-timezone")

const Sms = {
  findAll: withCache("smses", () => {
    const query = "SELECT * FROM smses"
    return dbQueryExecutor.execute(query)
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

        const smsWithDetails = {
          id: sms[0].id,
          api_id: sms[0].api_id,
          from: smsReleansData.from,
          client_id: sms[0].client_id,
          to: smsReleansData.to,
          message: sms[0].message,
          status: smsReleansData.status,
          sent_by_user_id: sms[0].sent_by_user_id,
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
