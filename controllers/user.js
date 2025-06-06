const bcrypt = require("bcrypt")

const { PassThrough } = require("stream")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { PERMISSION_DENIED } = require("@constants/errors/permission")
const { IMAGE_STREAMING_ERROR } = require("@constants/errors/shared/image")
const {
  USERNAME_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS,
  USER_NOT_FOUND,
  PASSWORD_MISMATCH,
  USER_AVATAR_IS_REQUIRED
} = require("@constants/errors/user")

const { IMAGE_ERROR_TYPE, PERMISSION_DENIED_ERROR_TYPE } = require("@constants/errors/shared/types")

const { SALT_ROUNDS } = require("@constants/bcrypt")

const roles = require("@constants/roles")

const mailer = require("@utils/mailer")
const processImage = require("@utils/processImage")
const formatPhoneNumber = require("@utils/formatPhoneNumber")
const adjustPaginationParams = require("@utils/adjustPaginationParams")

const User = require("@models/user")
const {
  createUserSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  updateUserProfileSchema,
  updateUserPasswordSchema
} = require("@schemas/user")

const Employee = require("@models/employee")

const { upload, VALID_IMAGE_EXTENSIONS } = require("@middlewares/uploadFileHandler")

const userController = {
  uploadAvatar: upload.single("avatar", VALID_IMAGE_EXTENSIONS),
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

    adjustPaginationParams(req)

    const { page, limit, searchTerm, filterBy, sortBy, sortOrder } = req.query

    const users = await User.findAll(page, limit, searchTerm, filterBy, sortBy, sortOrder)
    res.status(200).json(users)
  }),
  findProfile: tryCatch(async (req, res) => {
    const userId = req.user.id

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    res.status(200).json(existingUser)
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

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    res.status(200).json(existingUser)
  }),
  findAvatarByUserId: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { size, quality, blur } = req.query

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    const userAvatar = await User.findAvatar(existingUser[0].id)

    if (!userAvatar[0].avatar) {
      res.status(200).json({ username: existingUser[0].username })
      return
    }

    const options = {
      size: parseInt(size),
      quality: quality || "high",
      blur: blur ? parseInt(blur) : false
    }

    res.setHeader("Content-Type", userAvatar[0].avatar_mime_type)

    const readStream = new PassThrough()

    const processedImageBuffer = await processImage(Buffer.from(userAvatar[0].avatar), options)

    readStream.end(processedImageBuffer)
    readStream.pipe(res)

    readStream.on("error", () => {
      throw new AppError(
        500,
        IMAGE_STREAMING_ERROR,
        "Image streaming error",
        false,
        IMAGE_ERROR_TYPE
      )
    })

    readStream.on("end", () => {
      res.end()
    })
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

    const user = await User.create(username, hashedPassword, email, role, isActive, req.user.id)
    await Employee.create(user.insertId)

    await mailer
      .send(req.company.name, email, "Bem Vindo", `Seja muito bem vindo à ${req.company.name}`, {
        title: "Bem Vindo",
        message: `Seja muito bem-vindo(a) à ${
          req.company.name
        }! Estamos felizes em tê-lo(a) conosco.
                  <br>Para acessar à <a href="${req.protocol}://${req.get(
          "host"
        )}/auth/login">plataforma</a>, aqui estão seus dados de acesso:
                  <br>
                  <ul>
                    <li><strong>Nome de utilizador:</strong> ${username}</li>
                    <li><strong>Senha:</strong> ${password}</li>
                  </ul>
                  <br>
                  Aconselhamos seriamente a que assim que aceder à plataforma, <strong>altere</strong> a senha por uma de sua preferência.
                  <br>
                  <br>
                  Mal podemos esperar para ver o que você fará!`,
        footer: "Por motivos de segurança, recomendamos o não compartilhamento desta mensagem!",
        companyName: req.company.name,
        companyAddress: `${req.company.address}, ${req.company.postalCode}`,
        companyCity: req.company.city,
        companyCountry: req.company.country,
        companyPhoneNumber: formatPhoneNumber(req.company.phoneNumber),
        companyEmail: req.company.email,
        companyWebsite: req.company.website
      })
      .catch(() => {})
    res.status(201).json({ message: "User created successfully" })
  }),
  updateRole: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { role } = req.body

    updateUserRoleSchema.parse(req.body)

    const isCurrentUser = req.user.id === Number(userId)

    if (isCurrentUser) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You are not allowed to change your own role",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    } else {
      const currentUserRole = req.user.role

      if (currentUserRole !== roles.BOSS) {
        throw new AppError(
          403,
          PERMISSION_DENIED,
          "You don't have permission to perform this action",
          true,
          PERMISSION_DENIED_ERROR_TYPE
        )
      }

      if (role === roles.BOSS) {
        throw new AppError(
          403,
          PERMISSION_DENIED,
          "You are not allowed to assign the 'Boss' role",
          true,
          PERMISSION_DENIED_ERROR_TYPE
        )
      }
    }

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    await User.updateRole(userId, role)
    res.status(204).json({ message: "User role updated successfully" })
  }),
  updateStatus: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { isActive } = req.body

    updateUserStatusSchema.parse(req.body)

    const isCurrentUser = req.user.id === Number(userId)

    if (isCurrentUser) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You are not allowed to change your own role",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    const currentUserRole = req.user.role

    if (
      currentUserRole === roles.ADMIN &&
      (existingUser[0].role === roles.ADMIN || existingUser[0].role === roles.BOSS)
    ) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You don't have permission to perform this action",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

    await User.updateStatus(userId, isActive)
    res.status(204).json({ message: "User status updated successfully" })
  }),
  updateProfile: tryCatch(async (req, res) => {
    const userId = req.user.id
    const { username, email } = req.body

    updateUserProfileSchema.parse(req.body)

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    const existingUsername = await User.findByUsername(username, userId)
    if (existingUsername.length > 0) {
      throw new AppError(400, USERNAME_ALREADY_EXISTS, "The username already exists", true)
    }

    const existingEmail = await User.findByEmail(email, userId)
    if (existingEmail.length > 0) {
      throw new AppError(400, EMAIL_ALREADY_EXISTS, "The e-mail already exists", true)
    }

    await User.update(userId, username, email, existingUser[0].role, existingUser[0].is_active)
    res.status(204).json({ message: "Profile updated successfully" })
  }),
  updateProfileAvatar: tryCatch(async (req, res) => {
    if (req.file) {
      await User.updateAvatar(req.user.id, req.file.buffer, req.file.mimetype, req.file.size)
    } else {
      throw new AppError(400, USER_AVATAR_IS_REQUIRED, "User avatar is required", false)
    }

    res.status(204).json({ message: "Avatar updated successfully" })
  }),
  updatePassword: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { password, newPassword } = req.body

    updateUserPasswordSchema.parse(req.body)

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser[0].password)
    if (!isPasswordMatch) {
      throw new AppError(400, PASSWORD_MISMATCH, "Current password does not match", true)
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await User.updatePassword(userId, hashedNewPassword)
    res.status(204).json({ message: "Password updated successfully" })
  }),
  delete: tryCatch(async (req, res) => {
    const { userId } = req.params

    const currentUserRole = req.user.role

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    if (existingUser[0].role === roles.BOSS) {
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You don't have permission to perform this action",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

    if (
      currentUserRole === roles.ADMIN &&
      (existingUser[0].role === roles.ADMIN || existingUser[0].role === roles.BOSS)
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
