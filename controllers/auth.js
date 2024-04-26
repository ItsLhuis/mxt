const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { AUTHENTICATION_FAILED, INVALID_REFRESH_TOKEN } = require("@constants/errors/user")

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
    req.user = null

    req.session.refreshToken = null
    req.session.accessToken = null

    res.clearCookie("refreshToken")
    res.clearCookie("accessToken")

    res.status(200).json({ message: "Logout successful" })
  })
}

module.exports = authController
