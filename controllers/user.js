const bcrypt = require("bcrypt")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { PERMISSION_DENIED } = require("@constants/errors/permission")

const {
  USERNAME_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS,
  USER_NOT_FOUND,
  PASSWORD_MISMATCH
} = require("@constants/errors/user")

const { PERMISSION_DENIED_ERROR_TYPE } = require("@constants/errors/shared/types")

const { SALT_ROUNDS } = require("@constants/bcrypt")

const roles = require("@constants/roles")

const User = require("@models/user")
const { createUserSchema, updateUserSchema, updateUserPasswordSchema } = require("@schemas/user")

const Employee = require("@models/employee")

const { upload } = require("@middlewares/uploadFileHandler")

const userController = {
  uploadAvatar: upload.image.single("avatar"),
  findAll: tryCatch(async (req, res) => {
    const users = await User.findAll()
    res.status(200).json(users)
  }),
  create: tryCatch(async (req, res) => {
    const { username, password, email, role, isActive } = req.body

    createUserSchema.parse(req.body)

    const currentUserRole = req.user.role
    if (
      (currentUserRole === roles.BOSS && role === roles.BOSS) ||
      (currentUserRole === roles.ADMIN && role !== roles.EMPLOYEE)
    ) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You don't have permission to perform this action",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

    const existingUsername = await User.findByUsername(username)
    if (existingUsername.length > 0) {
      throw new AppError(400, USERNAME_ALREADY_EXISTS, "The username already exists", true)
    }

    const existingEmail = await User.findByEmail(email)
    if (existingEmail.length > 0) {
      throw new AppError(400, EMAIL_ALREADY_EXISTS, "The e-mail already exists", true)
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    let profilePic
    if (req.file) {
      profilePic = req.file.filename
    }

    const user = await User.create(username, hashedPassword, email, profilePic, role, isActive)
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

    let profilePic
    if (req.file) {
      profilePic = req.file.filename
    }

    await User.update(userId, username, email, profilePic, role, isActive)
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

    const currentUserRole = req.user.role

    const existingUser = await User.findById(userId)
    if (!existingUser.length) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    if (
      (currentUserRole !== roles.ADMIN || existingUser.role === roles.EMPLOYEE) &&
      (currentUserRole !== roles.BOSS || userId === req.user.id)
    ) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You don't have permission to perform this action",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

    await User.delete(userId)
    res.status(204).json({ message: "User removed successfully" })
  })
}

module.exports = userController
