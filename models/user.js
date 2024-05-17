const dbQueryExecutor = require("@utils/dbQueryExecutor")

const User = {
  findAll: () => {
    const query = "SELECT * FROM users"
    return dbQueryExecutor.execute(query)
  },
  findById: (id) => {
    const query = "SELECT * FROM users WHERE id = ?"
    return dbQueryExecutor.execute(query, [id])
  },
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
  create: (username, password, email, avatar, role, isActive) => {
    const query =
      "INSERT INTO users (username, password, email, avatar, role, is_active, created_at_datetime) VALUES (?, ?, ?, ?, ?, ?, NOW())"
    return dbQueryExecutor.execute(query, [username, password, email, avatar, role, isActive])
  },
  update: (id, username, email, avatar, role, isActive) => {
    const query =
      "UPDATE users SET username = ?, email = ?, avatar = ?, role = ?, is_active = ? WHERE id = ?"
    return dbQueryExecutor.execute(query, [username, email, avatar, role, isActive, id])
  },
  updatePassword: (id, password) => {
    const query = "UPDATE users SET password = ? WHERE id = ?"
    return dbQueryExecutor.execute(query, [password, id])
  },
  updatePasswordByEmail: (email, password) => {
    const query = "UPDATE users SET password = ? WHERE email = ?"
    return dbQueryExecutor.execute(query, [password, email])
  },
  delete: (id) => {
    const query = "DELETE FROM users WHERE id = ?"
    return dbQueryExecutor.execute(query, [id])
  },
  otpCode: {
    findByUserId: (userId) => {
      const query = "SELECT * FROM user_otp_codes WHERE user_id = ?"
      return dbQueryExecutor.execute(query, [userId])
    },
    findByOtpCode: (otpCode) => {
      const query = "SELECT * FROM user_otp_codes WHERE otp_code = ?"
      return dbQueryExecutor.execute(query, [otpCode])
    },
    create: (userId, otpCode) => {
      const query =
        "INSERT INTO user_otp_codes (user_id, otp_code, is_used, created_at_datetime, expiration_datetime) VALUES (?, ?, false, NOW(), DATE_ADD(NOW(), INTERVAL 5 MINUTE))"
      return dbQueryExecutor.execute(query, [userId, otpCode])
    },
    delete: (id) => {
      const query = "DELETE FROM user_otp_codes WHERE id = ?"
      return dbQueryExecutor.execute(query, [id])
    }
  }
}

module.exports = User
