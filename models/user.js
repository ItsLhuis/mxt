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
  },
  update: (id, username, email, role, isActive) => {
    const query = "UPDATE users SET username = ?, email = ?, role = ?, is_active = ? WHERE id = ?"
    return queryExecutor.execute(query, [username, email, role, isActive, id])
  },
  updatePassword: (id, password) => {
    const query = "UPDATE users SET password = ? WHERE id = ?"
    return queryExecutor.execute(query, [password, id])
  },
  delete: (id) => {
    const query = "DELETE FROM users WHERE id = ?"
    return queryExecutor.execute(query, [id])
  }
}

module.exports = User
