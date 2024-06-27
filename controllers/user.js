const { produce } = require("immer")

const bcrypt = require("bcrypt")

const { PassThrough } = require("stream")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const mailer = require("@utils/mailer")
const processImage = require("@utils/processImage")

const { PERMISSION_DENIED } = require("@constants/errors/permission")
const { IMAGE_STREAMING_ERROR } = require("@constants/errors/shared/image")
const {
  USERNAME_ALREADY_EXISTS,
  EMAIL_ALREADY_EXISTS,
  USER_NOT_FOUND,
  PASSWORD_MISMATCH
} = require("@constants/errors/user")

const { IMAGE_ERROR_TYPE, PERMISSION_DENIED_ERROR_TYPE } = require("@constants/errors/shared/types")

const { SALT_ROUNDS } = require("@constants/bcrypt")

const roles = require("@constants/roles")

const User = require("@models/user")
const { createUserSchema, updateUserSchema, updateUserPasswordSchema } = require("@schemas/user")

const Employee = require("@models/employee")

const upload = require("@middlewares/uploadFileHandler")

const userController = {
  uploadAvatar: upload.single("avatar"),
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

    const users = await User.findAll()

    const usersWithoutPassword = produce(users, (draft) => {
      draft.forEach((user) => {
        delete user.password
      })
    })

    res.status(200).json(usersWithoutPassword)
  }),
  findProfile: tryCatch(async (req, res) => {
    const userId = req.user.id

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    const userWithoutPassword = produce(existingUser[0], (draft) => {
      delete draft.password
    })

    res.status(200).json([userWithoutPassword])
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

    const userWithoutPassword = produce(existingUser[0], (draft) => {
      delete draft.password
    })

    res.status(200).json([userWithoutPassword])
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
        companyPhoneNumber: req.company.phoneNumber,
        companyEmail: req.company.email,
        companyWebsite: req.company.website
      })
      .catch(() => {})
    res.status(201).json({ message: "User created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { username, email, role, isActive } = req.body

    updateUserSchema.parse(req.body)

    const isCurrentUser = req.user.id === Number(userId)

    if (!isCurrentUser) {
      const currentUserRole = req.user.role

      if (
        role &&
        ((currentUserRole === roles.BOSS && role === roles.BOSS) ||
          (currentUserRole === roles.ADMIN &&
            (role !== roles.EMPLOYEE || role === roles.ADMIN || role === roles.BOSS)))
      ) {
        throw new AppError(
          403,
          PERMISSION_DENIED,
          "You don't have permission to perform this action",
          true,
          PERMISSION_DENIED_ERROR_TYPE
        )
      }
    } else {
      if (role !== undefined || isActive !== undefined) {
        throw new AppError(
          403,
          PERMISSION_DENIED,
          "You don't have permission to change your own role or active status",
          true,
          PERMISSION_DENIED_ERROR_TYPE
        )
      }
    }

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

    const finalRole = isCurrentUser ? existingUser[0].role : role ?? existingUser[0].role
    const finalIsActive = isCurrentUser
      ? existingUser[0].is_active
      : isActive ?? existingUser[0].is_active

    await User.update(userId, username, email, finalRole, finalIsActive)

    if (req.file) {
      await User.updateAvatar(existingUser[0].id, req.file.buffer, req.file.mimetype, req.file.size)
    }
    res.status(204).json({ message: "User updated successfully" })
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
