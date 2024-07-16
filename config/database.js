const mysql = require("mysql2")

const pool = mysql.createPool({
  uri: process.env.DB_URI,
  connectionLimit: 10,
  timezone: "+00:00"
})

const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        resolve(connection)
      }
    })
  })
}

module.exports = { getConnection }
