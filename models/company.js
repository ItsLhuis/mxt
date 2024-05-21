const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache } = require("@utils/cache")

const Company = {
  find: withCache("company", () => {
    const query = "SELECT * FROM company"
    return dbQueryExecutor.execute(query)
  }),
  initialize: () => {
    const query = "INSERT INTO company (enforce_one_row, created_at_datetime) VALUES (?, NOW())"
    return dbQueryExecutor.execute(query, ["only"]).then((result) => {
      return revalidateCache("company").then(() => result)
    })
  },
  update: (name, address, city, country, postalCode, phoneNumber, email, logo) => {
    const query =
      "UPDATE company SET name = ?, address = ?, city = ?, country = ?, postal_code = ?, phone_number = ?, email = ?, logo = ? WHERE enforce_one_row = 'only'"
    return dbQueryExecutor
      .execute(query, [name, address, city, country, postalCode, phoneNumber, email, logo])
      .then((result) => {
        return revalidateCache("company").then(() => result)
      })
  }
}

module.exports = Company
