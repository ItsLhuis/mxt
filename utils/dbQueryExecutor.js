const { getConnection } = require("@config/database")

const dbQueryExecutor = {
  execute: (query, values, conn) => {
    return new Promise((resolve, reject) => {
      ;(conn ? Promise.resolve(conn) : getConnection())
        .then((connection) => {
          connection.query(query, values, (error, results) => {
            if (error) {
              reject(error)
            } else {
              resolve(results)
            }
            if (!conn) {
              connection.release()
            }
          })
        })
        .catch(reject)
    })
  },
  startTransaction: () => {
    return new Promise((resolve, reject) => {
      getConnection()
        .then((connection) => {
          connection.beginTransaction((error) => {
            if (error) {
              reject(error)
            } else {
              resolve(connection)
            }
          })
        })
        .catch(reject)
    })
  },
  commitTransaction: (conn) => {
    return new Promise((resolve, reject) => {
      conn.commit((error) => {
        if (error) {
          reject(error)
        } else {
          conn.release()
          resolve()
        }
      })
    })
  },
  rollbackTransaction: (conn) => {
    return new Promise((resolve, reject) => {
      conn.rollback((error) => {
        if (error) {
          reject(error)
        } else {
          conn.release()
          resolve()
        }
      })
    })
  }
}

module.exports = dbQueryExecutor
