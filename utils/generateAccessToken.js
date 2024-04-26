const jwt = require("jsonwebtoken")

const AppError = require("@classes/app/error")

const { ERROR_GENERATING_TOKEN } = require("@constants/errors/user")

const generateAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    })

    return newAccessToken
  } catch (error) {
    throw new AppError(400, ERROR_GENERATING_TOKEN, "Error generating new access token", true)
  }
}

module.exports = generateAccessToken
