const dbQueryExecutor = require("@utils/dbQueryExecutor")

const Employee = {
  findAll: () => {
    const query = "SELECT * FROM employees"
    return dbQueryExecutor.execute(query)
  },
  findByUserId: (userId) => {
    const query = "SELECT * FROM employees WHERE user_id = ?"
    return dbQueryExecutor.execute(query, [userId])
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
    return dbQueryExecutor.execute(query, [
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
    return dbQueryExecutor.execute(query, [
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
