const bcrypt = require("bcrypt")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const {
  USERNAME_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS,
  USER_NOT_FOUND,
  PASSWORD_MISMATCH
} = require("@constants/errors/user")

const { SALT_ROUNDS } = require("@constants/bcrypt")

const User = require("@models/user")
const { createUserSchema, updateUserSchema, updateUserPasswordSchema } = require("@schemas/user")

const Employee = require("@models/employee")

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
      throw new AppError(400, USERNAME_ALREADY_EXISTS, "The username already exists", true)
    }

    const existingEmail = await User.findByEmail(email)
    if (existingEmail.length > 0) {
      throw new AppError(400, EMAIL_ALREADY_EXISTS, "The e-mail already exists", true)
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await User.create(username, hashedPassword, email, role, isActive)
    await Employee.create(user.insertId)
    res.status(201).json({ message: "User created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { username, email, role, isActive } = req.body

    const existingUser = await User.findById(userId)
    if (!existingUser.length) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    updateUserSchema.parse(req.body)

    const existingUsername = await User.findByUsername(username, userId)
    if (existingUsername.length > 0) {
      throw new AppError(400, USERNAME_ALREADY_EXISTS, "The username already exists", true)
    }

    const existingEmail = await User.findByEmail(email, userId)
    if (existingEmail.length > 0) {
      throw new AppError(400, EMAIL_ALREADY_EXISTS, "The e-mail already exists", true)
    }

    await User.update(userId, username, email, role, isActive)
    res.status(204).json({ message: "User updated successfully" })
  }),
  updatePassword: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { password, newPassword } = req.body

    const existingUser = await User.findById(userId)
    if (!existingUser.length) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    updateUserPasswordSchema.parse(req.body)

    const isPasswordMatch = await bcrypt.compare(password, existingUser[0].password)
    if (!isPasswordMatch) {
      throw new AppError(400, PASSWORD_MISMATCH, "Current password does not match", true)
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    User.updatePassword(userId, hashedNewPassword)
    res.status(204).json({ message: "Password updated successfully" })
  }),
  delete: tryCatch(async (req, res) => {
    const { userId } = req.params

    const existingUser = await User.findById(userId)
    if (!existingUser.length) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    await User.delete(userId)
    res.status(204).json({ message: "User removed successfully" })
  })
}

module.exports = userController
