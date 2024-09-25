const AppError = require("@classes/app/error")

const { EMAIL_SEND_ERROR } = require("@constants/errors/shared/email")

const { EMAIL_ERROR_TYPE } = require("@constants/errors/shared/types")

const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const mailer = require("@utils/mailer")

const Client = require("@models/client")
const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const isProduction = process.env.NODE_ENV === "production"

const Email = {
  findAll: async (
    page = 1,
    limit = 10,
    searchTerm = "",
    filterBy = {},
    sortBy = "created_at_datetime",
    sortOrder = "DESC"
  ) =>
    withCache(
      ["emails", page, limit, searchTerm, JSON.stringify(filterBy), sortBy, sortOrder],
      async () => {
        const offset = (page - 1) * limit

        const validFields = {
          search: {
            client_name: "client.name",
            to: "email.contact",
            subject: "email.subject",
            sent_by_user_username: "user.username",
            sent_by_user_role: "user.role"
          },
          filter: {
            client_name: "client.name",
            to: "email.contact",
            subject: "email.subject",
            sent_by_user_username: "user.username",
            sent_by_user_role: "user.role"
          },
          sort: {
            client_name: "client.name",
            to: "email.contact",
            subject: "email.subject",
            created_at_datetime: "email.created_at_datetime"
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

        const emailsCountQuery = `
          SELECT COUNT(*) AS total
          FROM emails email
          LEFT JOIN clients client ON email.client_id = client.id
          LEFT JOIN users user ON email.sent_by_user_id = user.id
          WHERE 1 = 1 ${searchCondition} ${filterConditions}
        `

        const emailsQuery = `
          SELECT email.*
          FROM emails email
          LEFT JOIN clients client ON email.client_id = client.id
          LEFT JOIN users user ON email.sent_by_user_id = user.id
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

        const [{ total }] = await dbQueryExecutor.execute(emailsCountQuery, params)
        const emails = await dbQueryExecutor.execute(emailsQuery, params)

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
              to: email.contact,
              subject: email.subject,
              sent_by_user: sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
              created_at_datetime: email.created_at_datetime
            }
          })
        )

        return {
          total,
          data: emailsWithDetails,
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
        let emailResendData = { from: null, html: null, text: null, last_event: null }

        try {
          emailResendData = await mailer.get(apiId)
        } catch (error) {}

        const [client, sentByUser] = await Promise.all([
          Client.findByClientId(email[0].client_id),
          User.findByUserId(email[0].sent_by_user_id)
        ])

        const lowerCaseStatus = emailResendData.last_event
          ? emailResendData.last_event.toLowerCase()
          : ""

        const statusText = (() => {
          switch (lowerCaseStatus) {
            case "sent":
              return "Enviado"
            case "delivered":
              return "Entregue"
            case "delivery_delayed":
              return "Entregue Atrasado"
            case "complained":
              return "Spam"
            case "bounced":
              return "Rejeitado"
            default:
              return "Desconhecido"
          }
        })()

        const statusColor = (() => {
          switch (lowerCaseStatus) {
            case "sent":
              return "info"
            case "delivered":
              return "success"
            case "delivery_delayed":
              return "warning"
            case "complained":
            case "bounced":
              return "error"
            default:
              return "default"
          }
        })()

        const emailWithDetails = {
          id: email[0].id,
          api_id: email[0].api_id,
          from: emailResendData.from,
          client:
            client || client.length > 0
              ? { id: client[0].id, name: client[0].name, description: client[0].description }
              : null,
          to: email[0].contact,
          subject: email[0].subject,
          html: emailResendData.html,
          text: emailResendData.text,
          status: {
            name: statusText,
            color: statusColor
          },
          sent_by_user: sentByUser || sentByUser.length > 0 ? mapUser(sentByUser[0]) : null,
          created_at_datetime: email[0].created_at_datetime,
          sent_at_datetime: email[0].created_at_datetime
        }

        return [emailWithDetails]
      },
      memoryOnlyCache
    )(),
  analytics: {
    getTotal: () => {
      const query = "SELECT COUNT(*) AS total FROM emails"
      return dbQueryExecutor.execute(query)
    },
    getLastSixCompleteMonthsTotal: () => {
      const query = `
        WITH MonthlyTotals AS (
          SELECT 
            DATE_FORMAT(created_at_datetime, '%Y-%m') AS month,
            COUNT(*) AS total
          FROM emails
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
          FROM emails
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
      const { latest_total, previous_total } = result[0] || { latest_total: 0, previous_total: 0 }

      if (previous_total === 0) {
        return latest_total === 0 ? 0 : 100
      }

      return ((latest_total - previous_total) / previous_total) * 100
    },
    getTotalsByMonthForYear: async (year) => {
      const query = `
        WITH MonthlyTotals AS (
          SELECT 
            DATE_FORMAT(e.created_at_datetime, '%Y-%m') AS month,
            COUNT(*) AS total
          FROM emails e
          WHERE YEAR(e.created_at_datetime) = ?
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
  send: (
    clientId,
    companyName,
    companyAddress,
    companyCity,
    companyCountry,
    companyPhoneNumber,
    companyEmail,
    companyWebsite,
    contact,
    title,
    subject,
    message,
    text,
    attachments,
    sentByUserId
  ) => {
    return new Promise((resolve, reject) => {
      mailer
        .send(
          companyName,
          contact,
          subject,
          text,
          {
            title,
            message,
            footer: "Por motivos de segurança, recomendamos o não compartilhamento desta mensagem!",
            companyName,
            companyAddress,
            companyCity,
            companyCountry,
            companyPhoneNumber,
            companyEmail,
            companyWebsite
          },
          "default",
          attachments
        )
        .then((data) => {
          const query =
            "INSERT INTO emails (api_id, client_id, contact, subject, sent_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
          return dbQueryExecutor.execute(query, [data.id, clientId, contact, subject, sentByUserId])
        })
        .then((result) => {
          return revalidateCache([["emails"]]).then(() => resolve(result))
        })
        .catch((error) => {
          reject(
            new AppError(
              500,
              EMAIL_SEND_ERROR,
              isProduction ? "Failed to send e-mail" : error,
              false,
              EMAIL_ERROR_TYPE
            )
          )
        })
    })
  }
}

module.exports = Email
