const queryExecutor = require("@utils/database/queryExecutor")

const Employee = {
  findAll: () => {
    const query = "SELECT * FROM employees"
    return queryExecutor.execute(query)
  },
  findByUserId: (userId) => {
    const query = "SELECT * FROM employees WHERE user_id = ?"
    return queryExecutor.execute(query, [userId])
  },
  create: (
    userId,
    name,
    phoneNumber,
    country,
    city,
    locality,
    address,
    postalCode,
    description
  ) => {
    const query =
      "INSERT INTO employees (user_id, name, phone_number, country, city, locality, address, postal_code, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    return queryExecutor.execute(query, [
      userId,
      name,
      phoneNumber,
      country,
      city,
      locality,
      address,
      postalCode,
      description
    ])
  },
  update: (
    userId,
    name,
    phoneNumber,
    country,
    city,
    locality,
    address,
    postalCode,
    description
  ) => {
    const query =
      "UPDATE employees SET name = ?, phone_number = ?, country = ?, city = ?, locality = ?, address = ?, postal_code = ?, description = ? WHERE user_id = ?"
    return queryExecutor.execute(query, [
      name,
      phoneNumber,
      country,
      city,
      locality,
      address,
      postalCode,
      description,
      userId
    ])
  }
}

module.exports = Employee
