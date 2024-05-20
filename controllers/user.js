const bcrypt = require("bcrypt")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const mailer = require("@utils/mailer")
const getImageUrl = require("@utils/getImageUrl")

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

const Company = require("@models/company")

const upload = require("@middlewares/uploadFileHandler")

const userController = {
  uploadAvatar: upload.image.single("avatar"),
  findAll: tryCatch(async (req, res) => {
    const users = await User.findAll()
    res.status(200).json(users)
  }),
  findByUserId: tryCatch(async (req, res) => {
    const { userId } = req.params

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
      throw new AppError(404, USER_NOT_FOUND, "User not found", true)
    }

    res.status(200).json(existingUser)
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

    console.log(user);
    await Employee.create(user.insertId)

    const companyDetails = await Company.find()
    const logoCompanyUrl = getImageUrl(req, companyDetails[0].logo)

    await mailer.send(
      companyDetails[0].name,
      email,
      "Bem Vindo",
      `Seja muito bem vindo à ${companyDetails[0].name}`,
      {
        companyLogo: logoCompanyUrl,
        title: "Bem Vindo",
        message: `Seja muito bem-vindo(a) à ${
          companyDetails[0].name
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
        companyName: companyDetails[0].name,
        companyAddress: `${companyDetails[0].address}, ${companyDetails[0].postal_code}`,
        companyCity: companyDetails[0].city,
        companyCountry: companyDetails[0].country
      }
    )

    res.status(201).json({ message: "User created successfully" })
  }),
  update: tryCatch(async (req, res) => {
    const { userId } = req.params
    const { username, email, role, isActive } = req.body

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
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

    const existingUser = await User.findByUserId(userId)
    if (existingUser.length <= 0) {
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
