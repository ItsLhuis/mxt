const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const destroyUser = require("@utils/destroyUser")
const sendEmail = require("@utils/sendEmail")
const generateOTP = require("@utils/generateOTP")

const {
  AUTHENTICATION_FAILED,
  INVALID_REFRESH_TOKEN,
  USER_NOT_ACTIVE
} = require("@constants/errors/user")

const generateAccessToken = require("@utils/generateAccessToken")

const User = require("@models/user")
const { authSchema } = require("@schemas/user")

const authController = {
  login: tryCatch(async (req, res) => {
    const { username, password } = req.body

    authSchema.parse(req.body)

    const user = await User.findByUsername(username)
    if (user.length === 0) {
      throw new AppError(401, AUTHENTICATION_FAILED, "Invalid username or password", true)
    }

    const isPasswordMatch = await bcrypt.compare(password, user[0].password)
    if (!isPasswordMatch) {
      throw new AppError(401, AUTHENTICATION_FAILED, "Invalid username or password", true)
    }

    if (!user[0].is_active) {
      throw new AppError(403, USER_NOT_ACTIVE, "User is not active", true)
    }

    const refreshToken = jwt.sign({ id: user[0].id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    })

    const accessToken = generateAccessToken(refreshToken)

    req.session.refreshToken = refreshToken
    req.session.accessToken = accessToken

    req.session.cookie.maxAge = process.env.REFRESH_TOKEN_EXPIRES_IN * 1000

    res.cookie("refreshToken", refreshToken, { httpOnly: true })
    res.cookie("accessToken", accessToken, { httpOnly: true })

    res.status(200).json({ message: "Authentication successful" })
  }),
  refreshToken: tryCatch(async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      throw new AppError(400, INVALID_REFRESH_TOKEN, "Refresh token is missing", true)
    }

    const newAccessToken = generateAccessToken(refreshToken)

    req.session.accessToken = newAccessToken

    res.cookie("accessToken", newAccessToken, { httpOnly: true })

    res.status(200).json({ message: "Reauthentication successful" })
  }),
  logout: tryCatch(async (req, res) => {
    await destroyUser(req, res)

    res.status(200).json({ message: "Logout successful" })
  }),
  requestResetPassword: tryCatch(async (req, res) => {
    const { to } = req.body

    const logoCompanyURL = `${req.protocol}://${req.get("host")}/api/v1/images/icon.png`

    const otpCode = generateOTP()

    await sendEmail(
      "Mixtura",
      to ?? "luisrodrigues6789@gmail.com",
      `Código de Verificação - ${otpCode}`,
      {
        username: "Luis",
        otpCode: otpCode,
        companyLogo: logoCompanyURL,
        companyName: "Mixtura",
        companyAddress: "R. 15 751, 4500-159",
        companyCity: "Espinho",
        companyCountry: "Portugal"
      },
      "resetPassword"
    ).then(() => {
      console.log("Enviado")
    })
  }),
  verifyResetPassword: tryCatch(async (req, res) => {}),
  confirmResetPassword: tryCatch(async (req, res) => {})
}

module.exports = authController
