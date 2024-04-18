const queryExecutor = require("@utils/database/queryExecutor")

const User = {
  findAll: () => {
    const query = "SELECT * FROM users"
    return queryExecutor.execute(query)
  },
  findById: (id) => {
    const query = "SELECT * FROM users WHERE id = ?"
    return queryExecutor.execute(query, [id])
  },
  findByUsername: (username) => {
    const query = "SELECT * FROM users WHERE username = ?"
    return queryExecutor.execute(query, [username])
  },
  findByEmail: (email) => {
    const query = "SELECT * FROM users WHERE email = ?"
    return queryExecutor.execute(query, [email])
  },
  create: (username, password, email, role, isActive) => {
    const query =
      "INSERT INTO users (username, password, email, role, is_active, created_at_datetime) VALUES (?, ?, ?, ?, ?, NOW())"
    return queryExecutor.execute(query, [username, password, email, role, isActive])
  }
}

module.exports = User
