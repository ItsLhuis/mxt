const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, diskOnlyCache } = require("@utils/cache")

const Company = {
  find: withCache("company", async () => {
    const query = `
      SELECT
        enforce_one_row,
        name,
        address,
        city,
        country,
        postal_code,
        phone_number,
        email,
        created_at_datetime
      FROM company`
    return dbQueryExecutor.execute(query)
  }),
  findLogo: () =>
    withCache(
      "company:logo",
      async () => {
        const query = "SELECT logo, logo_mime_type, logo_file_size FROM company"
        return dbQueryExecutor.execute(query)
      },
      diskOnlyCache
    )(),
  initialize: () => {
    const query =
      "INSERT INTO company (enforce_one_row, created_at_datetime) VALUES (?, CURRENT_TIMESTAMP())"
    return dbQueryExecutor.execute(query, ["only"]).then((result) => {
      return revalidateCache("company").then(() => result)
    })
  },
  update: (name, address, city, locality, country, postalCode, phoneNumber, email) => {
    const query =
      "UPDATE company SET name = ?, address = ?, city = ?, locality = ?, country = ?, postal_code = ?, phone_number = ?, email = ? WHERE enforce_one_row = 'only'"
    return dbQueryExecutor
      .execute(query, [
        name,
        address,
        city,
        locality,
        country,
        postalCode,
        phoneNumber.replace(/\s/g, ""),
        email
      ])
      .then((result) => {
        return revalidateCache("company").then(() => result)
      })
  },
  updateLogo: (logo, mimitype, fileSize) => {
    const query =
      "UPDATE company SET logo = ?, logo_mime_type = ?, logo_file_size = ? WHERE enforce_one_row = 'only'"
    return dbQueryExecutor.execute(query, [logo, mimitype, fileSize]).then((result) => {
      return revalidateCache("company:logo").then(() => result)
    })
  }
}

module.exports = Company
