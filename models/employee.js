const dbQueryExecutor = require("@utils/dbQueryExecutor")

const { withCache, revalidateCache, memoryOnlyCache } = require("@utils/cache")

const User = require("@models/user")
const mapUser = require("@utils/mapUser")

const Employee = {
  findAll: withCache("employees", async () => {
    const employeesQuery = "SELECT * FROM employees"
    const employees = await dbQueryExecutor.execute(employeesQuery)

    const employeesWithDetails = await Promise.all(
      employees.map(async (employee) => {
        const user = await User.findByUserId(employee.user_id)

        return {
          id: employee.id,
          user: user && user.length > 0 ? mapUser(user[0]) : null,
          name: employee.name,
          phone_number: employee.phone_number,
          country: employee.country,
          city: employee.city,
          locality: employee.locality,
          address: employee.address,
          postal_code: employee.postal_code,
          description: employee.description
        }
      })
    )

    return employeesWithDetails
  }),
  findByUserId: (userId) =>
    withCache(
      `employee:${userId}`,
      async () => {
        const employeeQuery = "SELECT * FROM employees WHERE user_id = ?"
        const employee = await dbQueryExecutor.execute(employeeQuery, [userId])

        if (!employee || employee.length <= 0) {
          return []
        }

        const user = await User.findByUserId(userId)

        const emplyeeWithDetails = {
          id: employee[0].id,
          user: user && user.length > 0 ? mapUser(user[0]) : null,
          name: employee[0].name,
          phone_number: employee[0].phone_number,
          country: employee[0].country,
          city: employee[0].city,
          locality: employee[0].locality,
          address: employee[0].address,
          postal_code: employee[0].postal_code,
          description: employee[0].description
        }

        return [emplyeeWithDetails]
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
