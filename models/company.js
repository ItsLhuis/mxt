const queryExecutor = require("@utils/database/queryExecutor")

const Company = {
  find: () => {
    const query = "SELECT * FROM company"
    return queryExecutor.execute(query)
  },
  initialize: () => {
    const query = "INSERT INTO company (enforce_one_row, created_at_datetime) VALUES (?, NOW())"
    return queryExecutor.execute(query, ["only"])
  },
  update: (name, address, city, country, postal_code, phone_number, email, logo) => {
    const query =
      "UPDATE company SET name = ?, address = ?, city = ?, country = ?, postal_code = ?, phone_number = ?, email = ?, logo = ? WHERE enforce_one_row = 'only'"
    return queryExecutor.execute(query, [
      name,
      address,
      city,
      country,
      postal_code,
      phone_number,
      email,
      logo
    ])
  }
}

module.exports = Company
