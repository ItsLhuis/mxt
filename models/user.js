const dbQueryExecutor = require("@utils/dbQueryExecutor")

const {
  withCache,
  revalidateCache,
  clearAllCaches,
  multiCache,
  memoryOnlyCache,
  diskOnlyCache
} = require("@utils/cache")

const mapUser = require("@utils/mapUser")

const User = {
  findAll: async (
    page = 1,
    limit = 10,
    searchTerm = "",
    filterBy = {},
    sortBy = "created_at_datetime",
    sortOrder = "DESC"
  ) =>
    withCache(
      ["users", page, limit, searchTerm, JSON.stringify(filterBy), sortBy, sortOrder],
      async () => {
        const offset = (page - 1) * limit

        const validFields = {
          search: {
            username: "u1.username",
            email: "u1.email",
            role: "u1.role",
            created_by_user_username: "u2.username",
            created_by_user_role: "u2.role"
          },
          filter: {
            username: "u1.username",
            email: "u1.email",
            role: "u1.role",
            created_by_user_username: "u2.username",
            created_by_user_role: "u2.role"
          },
          sort: {
            username: "u1.username",
            email: "u1.email",
            role: "u1.role",
            is_active: "u1.is_active",
            created_at_datetime: "u1.created_at_datetime"
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

        const usersCountQuery = `
                SELECT COUNT(*) AS total
                FROM users u1
                LEFT JOIN users u2 ON u1.created_by_user_id = u2.id
                WHERE 1 = 1 ${searchCondition} ${filterConditions}
            `

        const usersQuery = `
                SELECT 
                  u1.id,
                  u1.username,
                  u1.email,
                  u1.role,
                  u1.is_active,
                  u1.created_at_datetime,
                  u2.id AS created_by_user_id,
                  u2.username AS created_by_user_username,
                  u2.role AS created_by_user_role,
                  u2.email AS created_by_user_email,
                  u2.is_active AS created_by_user_is_active
                FROM users u1
                LEFT JOIN users u2 ON u1.created_by_user_id = u2.id
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

        const [{ total }] = await dbQueryExecutor.execute(usersCountQuery, params)
        const users = await dbQueryExecutor.execute(usersQuery, params)

        const usersWithDetails = users.map((user) => ({
          ...mapUser(user),
          created_by_user: user.created_by_user_id
            ? mapUser({
                id: user.created_by_user_id,
                username: user.created_by_user_username,
                email: user.created_by_user_email,
                role: user.created_by_user_role,
                is_active: user.created_by_user_is_active
              })
            : null,
          created_at_datetime: user.created_at_datetime
        }))

        return {
          total,
          data: usersWithDetails,
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
  findByUserId: (userId) =>
    withCache(
      `user:${userId}`,
      async () => {
        const userQuery = `
          SELECT 
            u1.id,
            u1.username,
            u1.email,
            u1.role,
            u1.is_active,
            u1.created_at_datetime,
            u2.id AS created_by_user_id,
            u2.username AS created_by_user_username,
            u2.email AS created_by_user_email,
            u2.role AS created_by_user_role,
            u2.is_active AS created_by_user_is_active
          FROM users u1
          LEFT JOIN users u2 ON u1.created_by_user_id = u2.id
          WHERE u1.id = ?
        `
        const user = await dbQueryExecutor.execute(userQuery, [userId])

        if (!user || user.length <= 0) {
          return []
        }

        const userWithDetails = {
          ...mapUser(user[0]),
          created_by_user: user[0].created_by_user_id
            ? mapUser({
                id: user[0].created_by_user_id,
                username: user[0].created_by_user_username,
                email: user[0].created_by_user_email,
                role: user[0].created_by_user_role,
                is_active: user[0].created_by_user_is_active
              })
            : null,
          created_at_datetime: user[0].created_at_datetime
        }

        return [userWithDetails]
      },
      memoryOnlyCache
    )(),
  findByUsername: (username, userIdToExclude) => {
    let query = `
      SELECT 
        id,
        username,
        password,
        email,
        role,
        is_active,
        created_at_datetime
      FROM users 
      WHERE username = ?`
    let params = [username]

    if (userIdToExclude) {
      query += " AND id != ?"
      params.push(userIdToExclude)
    }

    return dbQueryExecutor.execute(query, params)
  },
  findByEmail: (email, userIdToExclude) => {
    let query = `
      SELECT 
        id,
        username,
        email,
        role,
        is_active,
        created_at_datetime
      FROM users 
      WHERE email = ?`
    let params = [email]

    if (userIdToExclude) {
      query += " AND id != ?"
      params.push(userIdToExclude)
    }

    return dbQueryExecutor.execute(query, params)
  },
  findAvatar: (userId) =>
    withCache(
      `user:avatar:${userId}`,
      async () => {
        const query = "SELECT avatar, avatar_mime_type, avatar_file_size FROM users WHERE id = ?"
        return dbQueryExecutor.execute(query, [userId])
      },
      diskOnlyCache
    )(),
  hasBossRole: async () => {
    const query = `
        SELECT COUNT(*) AS count 
        FROM users 
        WHERE role = ?`
    const params = ["Chefe"]

    const [{ count }] = await dbQueryExecutor.execute(query, params)

    return count > 0
  },
  create: (username, password, email, role, isActive, createdByUserId) => {
    const query =
      "INSERT INTO users (username, password, email, role, is_active, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
    return dbQueryExecutor
      .execute(query, [username, password, email, role, isActive ?? true, createdByUserId])
      .then((result) => {
        return revalidateCache([["users"]]).then(() => result)
      })
  },
  update: (userId, username, email, role, isActive) => {
    const query = "UPDATE users SET username = ?, email = ?, role = ?, is_active = ? WHERE id = ?"
    return dbQueryExecutor
      .execute(query, [username, email, role, isActive, userId])
      .then((result) => {
        return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
      })
  },
  updateRole: (userId, role) => {
    const query = "UPDATE users SET role = ? WHERE id = ?"
    return dbQueryExecutor.execute(query, [role, userId]).then((result) => {
      return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
    })
  },
  updateStatus: (userId, isActive) => {
    const query = "UPDATE users SET is_active = ? WHERE id = ?"
    return dbQueryExecutor.execute(query, [isActive, userId]).then((result) => {
      return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
    })
  },
  updateAvatar: (userId, avatar, mimetype, fileSize) => {
    const query =
      "UPDATE users SET avatar = ?, avatar_mime_type = ?, avatar_file_size = ? WHERE id = ?"
    return dbQueryExecutor.execute(query, [avatar, mimetype, fileSize, userId]).then((result) => {
      return revalidateCache(`user:avatar:${userId}`).then(() => result)
    })
  },
  updatePassword: (userId, password) => {
    const query = "UPDATE users SET password = ? WHERE id = ?"
    return dbQueryExecutor.execute(query, [password, userId]).then((result) => {
      return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
    })
  },
  updatePasswordByEmail: (email, password) => {
    const query = "UPDATE users SET password = ? WHERE email = ?"
    return dbQueryExecutor.execute(query, [password, email]).then(async (result) => {
      return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
    })
  },
  delete: (userId) => {
    const query = "DELETE FROM users WHERE id = ?"
    return dbQueryExecutor.execute(query, [userId]).then((result) => {
      return clearAllCaches([multiCache, memoryOnlyCache]).then(() => result)
    })
  },
  otpCode: {
    findByOtpCode: (otpCode) => {
      const query = "SELECT * FROM user_otp_codes WHERE otp_code = ?"
      return dbQueryExecutor.execute(query, [otpCode])
    },
    findByOtpCodeAndUserId: (otpCode, userId) => {
      const query =
        "SELECT * FROM user_otp_codes WHERE otp_code = ? AND user_id = ? AND is_used = false AND CURRENT_TIMESTAMP() <= expiration_datetime"
      return dbQueryExecutor.execute(query, [otpCode, userId])
    },
    create: (userId, otpCode) => {
      const query =
        "INSERT INTO user_otp_codes (user_id, otp_code, is_used, created_at_datetime, expiration_datetime) VALUES (?, ?, false, CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 5 MINUTE))"
      return dbQueryExecutor.execute(query, [userId, otpCode])
    },
    markAsUsed: (otpCode) => {
      const query = "UPDATE user_otp_codes SET is_used = true WHERE otp_code = ?"
      return dbQueryExecutor.execute(query, [otpCode])
    },
    delete: (otpCodeId) => {
      const query = "DELETE FROM user_otp_codes WHERE id = ?"
      return dbQueryExecutor.execute(query, [otpCodeId])
    },
    deleteUnusedByUserId: (userId) => {
      const query = "DELETE FROM user_otp_codes WHERE user_id = ? AND is_used = false"
      return dbQueryExecutor.execute(query, [userId])
    }
  }
}

module.exports = User
