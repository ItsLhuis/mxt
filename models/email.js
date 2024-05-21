const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const Email = {
  findAll: withCache("emails", () => {
    const query = "SELECT * FROM emails"
    return dbQueryExecutor.execute(query)
  }),
  findByEmailId: (emailId) =>
    withCache(
      `email:${emailId}`,
      async () => {
        const query = "SELECT * FROM emails WHERE id = ?"
        return dbQueryExecutor.execute(query, [emailId])
      },
      memoryOnlyCache
    )(),
  create: (apiId, subject) => {
    const query = "INSERT INTO emails (api_id, subject, created_at_datetime) VALUES (?, ?, NOW())"
    return dbQueryExecutor.execute(query, [apiId, subject]).then((result) => {
      return revalidateCache("emails").then(() => result)
    })
  }
}

module.exports = Email
