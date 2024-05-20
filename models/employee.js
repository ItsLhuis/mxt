const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const Employee = {
  findAll: withCache("employees", () => {
    const query = "SELECT * FROM employees"
    return dbQueryExecutor.execute(query)
  }),
  findByUserId: (userId) =>
    withCache(
      `employee:${userId}`,
      async () => {
        const query = "SELECT * FROM employees WHERE user_id = ?"
        return dbQueryExecutor.execute(query, [userId])
      },
      memoryOnlyCache
    )(),
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
    return dbQueryExecutor
      .execute(query, [
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
      .then((result) => {
        return revalidateCache("employees").then(() => result)
      })
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
    return dbQueryExecutor
      .execute(query, [
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
      .then((result) => {
        return revalidateCache(["employees", `employee:${userId}`]).then(() => result)
      })
  }
}

module.exports = Employee
