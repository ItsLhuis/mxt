const dbQueryExecutor = require("@utils/dbQueryExecutor")

const {
  withCache,
  revalidateCache,
  clearAllCaches,
  multiCache,
  memoryOnlyCache,
  diskOnlyCache
} = require("@utils/cache")

const User = {
  findAll: withCache("users", async () => {
    const query = `
      SELECT 
        u1.id,
        u1.username,
        u1.password,
        u1.email,
        u1.role,
        u1.is_active,
        u1.created_at_datetime,
        u2.id AS created_by_user_id,
        u2.username AS created_by_username,
        u2.role AS created_by_role 
      FROM users u1
      LEFT JOIN users u2 ON u1.created_by_user_id = u2.id
      ORDER BY u1.created_at_datetime DESC`
    const users = await dbQueryExecutor.execute(query)

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_by_user: user.created_by_user_id
        ? {
            id: user.created_by_user_id,
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
          u1.id,
          u1.username,
          u1.password,
          u1.email,
          u1.role,
          u1.is_active,
          u1.created_at_datetime,
          u2.id AS created_by_user_id,
          u2.username AS created_by_username,
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
          role: user[0].role,
          is_active: user[0].is_active,
          created_by_user: user[0].created_by_user_id
            ? {
                id: user[0].created_by_user_id,
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
        password,
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
  create: (username, password, email, role, isActive, createdByUserId) => {
    const query =
      "INSERT INTO users (username, password, email, role, is_active, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())"
    return dbQueryExecutor
      .execute(query, [username, password, email, role, isActive ?? true, createdByUserId])
      .then((result) => {
        return revalidateCache("users").then(() => result)
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
  updateAvatar: (userId, avatar, mimitype, fileSize) => {
    const query =
      "UPDATE users SET avatar = ?, avatar_mime_type = ?, avatar_file_size = ? WHERE id = ?"
    return dbQueryExecutor.execute(query, [avatar, mimitype, fileSize, userId]).then((result) => {
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
