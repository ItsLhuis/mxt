const jwt = require("jsonwebtoken")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const destroyUser = require("@utils/destroyUser")

const {
  REFRESH_TOKEN_NOT_PROVIDED,
  TOKEN_NOT_PROVIDED,
  INVALID_REFRESH_TOKEN,
  INVALID_TOKEN,
  USER_NOT_FOUND,
  USER_NOT_ACTIVE
} = require("@constants/errors/user")

const User = require("@models/user")

const authToken = tryCatch(async (req, res, next) => {
  const refreshTokenFromRequest = req.cookies.refreshToken
  const accessTokenFromRequest = req.cookies.accessToken

  const refreshTokenFromSession = req.session.refreshToken
  const accessTokenFromSession = req.session.accessToken

  if (!refreshTokenFromRequest) {
    throw new AppError(
      401,
      REFRESH_TOKEN_NOT_PROVIDED,
      "Refresh token not provided",
      undefined,
      "Authentication"
    )
  }
  if (!accessTokenFromRequest) {
    throw new AppError(
      401,
      TOKEN_NOT_PROVIDED,
      "Access token not provided",
      undefined,
      "Authentication"
    )
  }

  if (refreshTokenFromRequest !== refreshTokenFromSession) {
    throw new AppError(
      403,
      INVALID_REFRESH_TOKEN,
      "Invalid refresh token",
      undefined,
      "Authentication"
    )
  }
  if (accessTokenFromRequest !== accessTokenFromSession) {
    throw new AppError(403, INVALID_TOKEN, "Invalid access token", undefined, "Authentication")
  }

  await verifyRefreshToken(refreshTokenFromRequest)
  const user = await verifyAccessToken(accessTokenFromRequest)

  const existingUser = await User.findById(user.id)
  if (!existingUser || !existingUser.length) {
    await destroyUser(req, res)
    throw new AppError(404, USER_NOT_FOUND, "User not found", true, "Authentication")
  }

  if (!existingUser[0].is_active) {
    await destroyUser(req, res)
    throw new AppError(403, USER_NOT_ACTIVE, "User is not active", true, "Authentication")
  }

  req.user.id = existingUser[0].id

  next()
})

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error) => {
      if (error) {
        throw new AppError(
          403,
          INVALID_REFRESH_TOKEN,
          "Invalid refresh token",
          undefined,
          "Authentication"
        )
      }
      resolve()
    })
  })
}

const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        throw new AppError(403, INVALID_TOKEN, "Invalid access token", undefined, "Authentication")
      }
      resolve(user)
    })
  })
}

module.exports = authToken
