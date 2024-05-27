const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const User = {
  findAll: withCache("users", async () => {
    const query = `
      SELECT 
        u1.*, 
        u2.id AS created_by_user_id, 
        u2.username AS created_by_username,
        u2.avatar AS created_by_avatar, 
        u2.role AS created_by_role 
      FROM users u1
      LEFT JOIN users u2 ON u1.created_by_user_id = u2.id`
    const users = await dbQueryExecutor.execute(query)

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      password: user.password,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      is_active: user.is_active,
      created_by_user: user.created_by_user_id
        ? {
            id: user.created_by_user_id,
            avatar: user.created_by_avatar,
            username: user.created_by_username,
            role: user.created_by_role
          }
        : null,
      created_at_datetime: user.created_at_datetime
    }))
  }),
  findByUserId: (userId) =>
    withCache(
      `user:${userId}`,
      async () => {
        const userQuery = `
        SELECT 
          u1.*, 
          u2.id AS created_by_user_id, 
          u2.username AS created_by_username, 
          u2.email AS created_by_email, 
          u2.avatar AS created_by_avatar, 
          u2.role AS created_by_role 
        FROM users u1
        LEFT JOIN users u2 ON u1.created_by_user_id = u2.id
        WHERE u1.id = ?`
        const user = await dbQueryExecutor.execute(userQuery, [userId])

        if (!user || user.length <= 0) {
          return []
        }

        const userWithDetails = {
          id: user[0].id,
          username: user[0].username,
          password: user[0].password,
          email: user[0].email,
          avatar: user[0].avatar,
          role: user[0].role,
          is_active: user[0].is_active,
          created_by_user: user[0].created_by_user_id
            ? {
                id: user[0].created_by_user_id,
                avatar: user[0].created_by_avatar,
                username: user[0].created_by_username,
                role: user[0].created_by_role
              }
            : null,
          created_at_datetime: user[0].created_at_datetime
        }

        return [userWithDetails]
      },
      memoryOnlyCache
    )(),
  findByUsername: (username, userIdToExclude) => {
    let query = "SELECT * FROM users WHERE username = ?"
    let params = [username]

    if (userIdToExclude) {
      query += " AND id != ?"
      params.push(userIdToExclude)
    }

    return dbQueryExecutor.execute(query, params)
  },
  findByEmail: (email, userIdToExclude) => {
    let query = "SELECT * FROM users WHERE email = ?"
    let params = [email]

    if (userIdToExclude) {
      query += " AND id != ?"
      params.push(userIdToExclude)
    }

    return dbQueryExecutor.execute(query, params)
  },
  create: (username, password, email, avatar, role, isActive, createdByUserId) => {
    const query =
      "INSERT INTO users (username, password, email, avatar, role, is_active, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
    return dbQueryExecutor
      .execute(query, [username, password, email, avatar, role, isActive ?? true, createdByUserId])
      .then((result) => {
        return revalidateCache("users").then(() => result)
      })
  },
  update: (userId, username, email, avatar, role, isActive) => {
    const query =
      "UPDATE users SET username = ?, email = ?, avatar = ?, role = ?, is_active = ? WHERE id = ?"
    return dbQueryExecutor
      .execute(query, [username, email, avatar, role, isActive, userId])
      .then((result) => {
        return revalidateCache(["users", `user:${userId}`]).then(() => result)
      })
  },
  updatePassword: (userId, password) => {
    const query = "UPDATE users SET password = ? WHERE id = ?"
    return dbQueryExecutor.execute(query, [password, userId]).then((result) => {
      return revalidateCache(["users", `user:${userId}`]).then(() => result)
    })
  },
  updatePasswordByEmail: (email, password) => {
    const query = "UPDATE users SET password = ? WHERE email = ?"
    return dbQueryExecutor.execute(query, [password, email]).then(async (result) => {
      const user = await User.findByEmail(email)
      const userId = user[0].id

      return revalidateCache(["users", userId && `user:${userId}`].filter(Boolean)).then(
        () => result
      )
    })
  },
  delete: (userId) => {
    const query = "DELETE FROM users WHERE id = ?"
    return dbQueryExecutor.execute(query, [userId]).then((result) => {
      return revalidateCache(["users", `user:${userId}`, `employee:${userId}`]).then(() => result)
    })
  },
  otpCode: {
    findByOtpCode: (otpCode) => {
      const query = "SELECT * FROM user_otp_codes WHERE otp_code = ?"
      return dbQueryExecutor.execute(query, [otpCode])
    },
    findByOtpCodeAndUserId: (otpCode, userId) => {
      const query =
        "SELECT * FROM user_otp_codes WHERE otp_code = ? AND user_id = ? AND is_used = false AND NOW() <= expiration_datetime"
      return dbQueryExecutor.execute(query, [otpCode, userId])
    },
    create: (userId, otpCode) => {
      const query =
        "INSERT INTO user_otp_codes (user_id, otp_code, is_used, created_at_datetime, expiration_datetime) VALUES (?, ?, false, NOW(), DATE_ADD(NOW(), INTERVAL 5 MINUTE))"
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
