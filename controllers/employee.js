const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { PERMISSION_DENIED } = require("@constants/errors/permission")
const { USER_NOT_FOUND } = require("@constants/errors/user")
const { ACTIVITY_YEAR_NOT_PROVIDED } = require("@constants/errors/shared/analytics")

const { PERMISSION_DENIED_ERROR_TYPE } = require("@constants/errors/shared/types")

const roles = require("@constants/roles")

const Employee = require("@models/employee")
const { employeeSchema } = require("@schemas/employee")

const employeeController = {
  findAll: tryCatch(async (req, res) => {
    if (req.user.role === roles.EMPLOYEE) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You don't have permission to perform this action",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

    const employees = await Employee.findAll()
    res.status(200).json(employees)
  }),
  findByUserId: tryCatch(async (req, res) => {
    const { userId } = req.params

    if (req.user.role === roles.EMPLOYEE && req.user.id !== Number(userId)) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You don't have permission to perform this action",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

    const existingUser = await Employee.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    res.status(200).json(existingUser)
  }),
  analytics: {
    summary: tryCatch(async (req, res) => {
      const total = await Employee.analytics.getTotal()
      const lastMonthsTotal = await Employee.analytics.getLastTwoCompleteMonthsTotal()
      const lastMonthsPercentageChange =
        await Employee.analytics.getLastTwoCompleteMonthsPercentageChange()

      res.status(200).json({
        total: total[0]["total"],
        last_months_total: lastMonthsTotal,
        percentage_change_last_two_months: lastMonthsPercentageChange
      })
    }),
    activity: tryCatch(async (req, res) => {
      let { year } = req.params

      if (!year) {
        throw new AppError(400, ACTIVITY_YEAR_NOT_PROVIDED, "Year is required", true)
      }

      year = Number(year)

      if (
        isNaN(year) ||
        year.toString().length !== 4 ||
        year < 1900 ||
        year > new Date().getFullYear()
      ) {
        throw new AppError(400, ACTIVITY_YEAR_NOT_PROVIDED, "Invalid year provided", true)
      }

      const totalsByMonthForYear = await Employee.analytics.getTotalsByMonthForYear(year)
      const totalForYear = totalsByMonthForYear.reduce((acc, monthData) => acc + monthData.total, 0)

      res.status(200).json({
        year: year,
        total_for_year: totalForYear,
        totals_by_month_for_year: totalsByMonthForYear
      })
    })
  },
  update: tryCatch(async (req, res) => {
    const userId = req.user.id
    const { name, phoneNumber, country, city, locality, address, postalCode, description } =
      req.body

    employeeSchema.parse(req.body)

    const existingUser = await Employee.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    await Employee.update(
      userId,
      name,
      phoneNumber,
      country,
      city,
      locality,
      address,
      postalCode,
      description
    )
    res.status(204).json({ message: "Employee updated successfully" })
  })
}

module.exports = employeeController
