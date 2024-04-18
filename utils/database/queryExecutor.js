const connection = require("@config/database")

const queryExecutor = {
  execute: (query, values) => {
    return new Promise((resolve, reject) => {
      connection.query(query, values, (error, results, fields) => {
        if (error) {
          reject(error)
          return
        }
        resolve(results)
      })
    })
  }
}

module.exports = queryExecutor
