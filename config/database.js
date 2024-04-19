const mysql = require("mysql2")

const connection = mysql.createConnection(process.env.DB_URI)

module.exports = connection
