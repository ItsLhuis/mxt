const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { USERNAME_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS } = require("@constants/errors/user")

const User = require("@models/user")
const { createUserSchema } = require("@schemas/user")

const userController = {
  findAll: tryCatch(async (req, res) => {
    const users = await User.findAll()
    res.status(200).json(users)
  }),
  create: tryCatch(async (req, res) => {
    const { username, password, email, role, isActive } = req.body

    createUserSchema.parse(req.body)

    const existingUsername = await User.findByUsername(username)
    if (existingUsername.length > 0) {
      throw new AppError(400, USERNAME_ALREADY_EXISTS, "Nome de utilizador já existente", true)
    }

    const existingEmail = await User.findByEmail(email)
    if (existingEmail.length > 0) {
      throw new AppError(400, EMAIL_ALREADY_EXISTS, "E-mail já existente", true)
    }

    const newUser = await User.create(username, password, email, role, isActive)
    res.status(201).json(newUser)
  })
}

module.exports = userController
