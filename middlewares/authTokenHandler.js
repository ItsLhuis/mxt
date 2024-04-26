const jwt = require("jsonwebtoken")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const {
  REFRESH_TOKEN_NOT_PROVIDED,
  TOKEN_NOT_PROVIDED,
  INVALID_REFRESH_TOKEN,
  INVALID_TOKEN
} = require("@constants/errors/user")

const authToken = tryCatch((req, res, next) => {
  const refreshTokenFromRequest = req.cookies.refreshToken
  const accessTokenFromRequest = req.cookies.accessToken

  const refreshTokenFromSession = req.session.refreshToken
  const accessTokenFromSession = req.session.accessToken

  if (!refreshTokenFromRequest) {
    throw new AppError(401, REFRESH_TOKEN_NOT_PROVIDED, "Refresh token not provided", true)
  }
  if (!accessTokenFromRequest) {
    throw new AppError(401, TOKEN_NOT_PROVIDED, "Access token not provided", true)
  }

  if (refreshTokenFromRequest !== refreshTokenFromSession) {
    throw new AppError(403, INVALID_REFRESH_TOKEN, "Invalid refresh token", true)
  }
  if (accessTokenFromRequest !== accessTokenFromSession) {
    throw new AppError(403, INVALID_TOKEN, "Invalid access token", true)
  }

  jwt.verify(refreshTokenFromRequest, process.env.REFRESH_TOKEN_SECRET, (error) => {
    if (error) {
      throw new AppError(403, INVALID_REFRESH_TOKEN, "Invalid refresh token", true)
    }

    jwt.verify(accessTokenFromRequest, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        throw new AppError(403, INVALID_TOKEN, "Invalid access token", true)
      }

      req.user.id = user.id

      next()
    })
  })
})

module.exports = authToken
