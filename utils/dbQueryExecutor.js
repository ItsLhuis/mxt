const connection = require("@config/database")

const dbQueryExecutor = {
  execute: (query, values) => {
    return new Promise((resolve, reject) => {
      connection.query(query, values, (erroror, results, fields) => {
        if (erroror) {
          return reject(erroror)
        }
        resolve(results)
      })
    })
  },
  startTransaction: () => {
    return new Promise((resolve, reject) => {
      connection.beginTransaction((error) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  },
  commitTransaction: () => {
    return new Promise((resolve, reject) => {
      connection.commit((error) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  },
  rollbackTransaction: () => {
    return new Promise((resolve, reject) => {
      connection.rollback((error) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  }
}

module.exports = dbQueryExecutor
