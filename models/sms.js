const AppError = require("@classes/app/error")

const { SMS_SEND_ERROR } = require("@constants/errors/shared/sms")

const { SMS_ERROR_TYPE } = require("@constants/errors/shared/types")

const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const ReleansClient = require("@classes/releans")
const releans = new ReleansClient(process.env.RELEANS_API_KEY)

const convertTimeZone = require("@utils/convertTimeZone")

const Client = require("@models/client")
const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const isProduction = process.env.NODE_ENV === "production"

const Sms = {
  findAll: async (
    page = 1,
    limit = 10,
    searchTerm = "",
    filterBy = {},
    sortBy = "created_at_datetime",
    sortOrder = "DESC"
  ) =>
    withCache(
      ["smses", page, limit, searchTerm, JSON.stringify(filterBy), sortBy, sortOrder],
      async () => {
        const offset = (page - 1) * limit

        const validFields = {
          search: {
            client_name: "client.name",
            to: "sms.contact",
            message: "sms.message",
            sent_by_user_username: "user.username",
            sent_by_user_role: "user.role"
          },
          filter: {
            client_name: "client.name",
            to: "sms.contact",
            message: "sms.message",
            sent_by_user_username: "user.username",
            sent_by_user_role: "user.role"
          },
          sort: {
            client_name: "client.name",
            to: "sms.contact",
            message: "sms.message",
            created_at_datetime: "sms.created_at_datetime"
          }
        }

        const searchCondition = searchTerm
          ? `
            AND (
              ${Object.keys(validFields.search)
                .map((key) => `${validFields.search[key]} LIKE ?`)
                .join(" OR ")}
            )
          `
          : ""

        const filteredFilterBy = Object.keys(filterBy)
          .filter((key) => validFields.filter[key])
          .reduce((obj, key) => {
            obj[key] = filterBy[key]
            return obj
          }, {})

        const filterConditions = Object.keys(filteredFilterBy)
          .map((key) => `AND ${validFields.filter[key]} LIKE ?`)
          .join(" ")

        const sortByKey = Object.keys(validFields.sort).includes(sortBy)
          ? sortBy
          : "created_at_datetime"
        const sortByColumn = validFields.sort[sortByKey]

        const smsesCountQuery = `
          SELECT COUNT(*) AS total
          FROM smses sms
          LEFT JOIN clients client ON sms.client_id = client.id
          LEFT JOIN users user ON sms.sent_by_user_id = user.id
          WHERE 1 = 1 ${searchCondition} ${filterConditions}
        `

        const smsesQuery = `
          SELECT sms.*
          FROM smses sms
          LEFT JOIN clients client ON sms.client_id = client.id
          LEFT JOIN users user ON sms.sent_by_user_id = user.id
          WHERE 1 = 1 ${searchCondition} ${filterConditions}
          ORDER BY ${sortByColumn} ${sortOrder}
          LIMIT ? OFFSET ?
        `

        const params = [
          ...(searchTerm ? Object.keys(validFields.search).map(() => `%${searchTerm}%`) : []),
          ...Object.values(filteredFilterBy).map((value) => `%${value}%`),
          limit,
          offset
        ]

        const [{ total }] = await dbQueryExecutor.execute(smsesCountQuery, params)
        const smses = await dbQueryExecutor.execute(smsesQuery, params)

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
                  ? {
                      id: client[0].id,
                      name: client[0].name,
                      description: client[0].description
                    }
                  : null,
              to: sms.contact,
              message: sms.message,
              sent_by_user: sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
              created_at_datetime: sms.created_at_datetime
            }
          })
        )

        return {
          total,
          data: smsesWithDetails,
          page,
          limit,
          search_term: searchTerm,
          filter_by: filteredFilterBy,
          sort_by: sortByKey,
          sort_order: sortOrder,
          request_info: {
            valid_search_terms: Object.keys(validFields.search),
            valid_filters: Object.keys(validFields.filter),
            valid_sort_by: Object.keys(validFields.sort)
          }
        }
      },
      memoryOnlyCache
    )(),
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

        const convertReleansTimeZone =
          smsReleansData && smsReleansData.date_sent && smsReleansData.timezone
            ? convertTimeZone(smsReleansData.date_sent, smsReleansData.timezone)
            : sms[0].created_at_datetime

        const lowerCaseStatus = smsReleansData.status ? smsReleansData.status.toLowerCase() : ""

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
            case "delivered":
              return "success"
            case "failed":
            case "undelivered":
              return "error"
            case "sent":
            case "queued":
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
              ? {
                  id: client[0].id,
                  name: client[0].name,
                  description: client[0].description
                }
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
  analytics: {
    getTotal: () => {
      const query = "SELECT COUNT(*) AS total FROM smses"
      return dbQueryExecutor.execute(query)
    },
    getLastSixCompleteMonthsTotal: () => {
      const query = `
        WITH MonthlyTotals AS (
          SELECT 
            DATE_FORMAT(created_at_datetime, '%Y-%m') AS month,
            COUNT(*) AS total
          FROM smses
          WHERE created_at_datetime >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY month
        ),
        FullMonths AS (
          SELECT
            DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (5 - i) MONTH), '%Y-%m') AS month
          FROM (SELECT 0 i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) numbers
        )
        SELECT 
          f.month,
          COALESCE(m.total, 0) AS total
        FROM FullMonths f
        LEFT JOIN MonthlyTotals m ON f.month = m.month
        ORDER BY f.month
      `
      return dbQueryExecutor.execute(query)
    },
    getLastTwoCompleteMonthsPercentageChange: async () => {
      const query = `
        WITH MonthlyTotals AS (
          SELECT 
            DATE_FORMAT(created_at_datetime, '%Y-%m') AS month,
            COUNT(*) AS total
          FROM smses
          WHERE created_at_datetime < CURDATE()
          GROUP BY month
        ),
        LastTwoCompleteMonths AS (
          SELECT 
            month, 
            total
          FROM MonthlyTotals
          WHERE month BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%Y-%m') AND DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')
          ORDER BY month DESC
        )
        SELECT 
          COALESCE(
            MAX(CASE WHEN row_num = 1 THEN total END), 0
          ) AS latest_total,
          COALESCE(
            MAX(CASE WHEN row_num = 2 THEN total END), 0
          ) AS previous_total
        FROM (
          SELECT 
            month,
            total,
            ROW_NUMBER() OVER (ORDER BY month DESC) AS row_num
          FROM LastTwoCompleteMonths
        ) AS numbered_totals
      `

      const result = await dbQueryExecutor.execute(query)
      const { latest_total, previous_total } = result[0] || {
        latest_total: 0,
        previous_total: 0
      }

      if (previous_total === 0) {
        return latest_total === 0 ? 0 : 100
      }

      return ((latest_total - previous_total) / previous_total) * 100
    },
    getTotalsByMonthForYear: async (year) => {
      const query = `
        WITH MonthlyTotals AS (
          SELECT 
            DATE_FORMAT(s.created_at_datetime, '%Y-%m') AS month,
            COUNT(*) AS total
          FROM smses s
          WHERE YEAR(s.created_at_datetime) = ?
          GROUP BY month
        ),
        FullMonths AS (
          SELECT
            DATE_FORMAT(STR_TO_DATE(CONCAT(?, '-', numbers.i, '-01'), '%Y-%m-%d'), '%Y-%m') AS month
          FROM (SELECT 1 i UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) numbers
        )
        SELECT 
          f.month,
          COALESCE(m.total, 0) AS total
        FROM FullMonths f
        LEFT JOIN MonthlyTotals m ON f.month = m.month
        ORDER BY f.month;
      `

      return dbQueryExecutor.execute(query, [year, year])
    }
  },
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
          return revalidateCache([["smses"]]).then(() => resolve(result))
        })
        .catch((error) => {
          reject(
            new AppError(
              500,
              SMS_SEND_ERROR,
              isProduction ? "Failed to send SMS" : error,
              false,
              SMS_ERROR_TYPE
            )
          )
        })
    })
  }
}

module.exports = Sms
