const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { PERMISSION_DENIED } = require("@constants/errors/permission")
const { USER_NOT_FOUND } = require("@constants/errors/user")

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
  update: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { name, phoneNumber, country, city, locality, address, postalCode, description } =
      req.body

    employeeSchema.parse(req.body)

    if (req.user.id !== Number(userId)) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You don't have permission to change your own role or active status",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

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
