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
        const createdByUser = await User.findByUserId(user[0].id)

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
          description: employee.description,
          created_by_user: createdByUser[0].created_by_user
            ? mapUser(createdByUser[0].created_by_user)
            : null,
          created_at_datetime: createdByUser[0].created_at_datetime
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
        const createdByUser = await User.findByUserId(user[0].id)

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
          description: employee[0].description,
          created_by_user: createdByUser[0].created_by_user
            ? mapUser(createdByUser[0].created_by_user)
            : null,
          created_at_datetime: createdByUser[0].created_at_datetime
        }

        return [emplyeeWithDetails]
      },
      memoryOnlyCache
    )(),
  getTotal: () => {
    const query = "SELECT COUNT(*) AS total FROM employees"
    return dbQueryExecutor.execute(query)
  },
  getLastMonthsTotal: () => {
    const query = `
      WITH MonthlyTotals AS (
        SELECT 
          DATE_FORMAT(u.created_at_datetime, '%Y-%m') AS month,
          COUNT(*) AS total
        FROM employees e
        JOIN users u ON e.user_id = u.id
        WHERE u.created_at_datetime >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY month
      ),
      FullMonths AS (
        SELECT
          DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (5 - i) MONTH), '%Y-%m') AS month
        FROM (SELECT 0 i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) numbers
      )
      SELECT 
        f.month,
        COALESCE(m.total, 0) AS total
      FROM FullMonths f
      LEFT JOIN MonthlyTotals m ON f.month = m.month
      ORDER BY f.month
    `
    return dbQueryExecutor.execute(query)
  },
  getLastMonthsPercentageChange: async () => {
    const query = `
      WITH MonthlyTotals AS (
        SELECT 
          DATE_FORMAT(u.created_at_datetime, '%Y-%m') AS month,
          COUNT(*) AS total
        FROM employees e
        JOIN users u ON e.user_id = u.id
        WHERE u.created_at_datetime < CURDATE()
        GROUP BY month
      ),
      LastTwoMonths AS (
        SELECT 
          month, 
          total
        FROM MonthlyTotals
        WHERE month < DATE_FORMAT(CURDATE(), '%Y-%m')
        ORDER BY month DESC
        LIMIT 2
      )
      SELECT 
        COALESCE(
          MAX(CASE WHEN row_num = 1 THEN total END), 0
        ) AS latest_total,
        COALESCE(
          MAX(CASE WHEN row_num = 2 THEN total END), 0
        ) AS previous_total
      FROM (
        SELECT 
          month,
          total,
          ROW_NUMBER() OVER (ORDER BY month DESC) AS row_num
        FROM LastTwoMonths
      ) AS numbered_totals
    `

    const result = await dbQueryExecutor.execute(query)
    const { latest_total, previous_total } = result[0] || { latest_total: 0, previous_total: 0 }

    if (previous_total === 0) {
      return latest_total === 0 ? 0 : 100
    }

    return ((latest_total - previous_total) / previous_total) * 100
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
    return dbQueryExecutor
      .execute(query, [
        userId,
        name,
        phoneNumber && phoneNumber.replace(/\s/g, ""),
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
        phoneNumber.replace(/\s/g, ""),
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
