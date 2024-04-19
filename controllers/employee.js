const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { USER_NOT_FOUND } = require("@constants/errors/user")

const Employee = require("@models/employee")
const { employeeSchema } = require("@schemas/employee")

const employeeController = {
  findAll: tryCatch(async (req, res) => {
    const employees = await Employee.findAll()
    res.status(200).json(employees)
  }),
  update: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { name, phoneNumber, country, city, locality, address, postalCode, description } =
      req.body

    employeeSchema.parse(req.body)

    const existingUserId = await Employee.findByUserId(userId)
    if (existingUserId.length <= 0) {
      throw new AppError(400, USER_NOT_FOUND, "User not found", true)
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
