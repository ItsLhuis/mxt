const jwt = require("jsonwebtoken")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const {
  REFRESH_TOKEN_NOT_PROVIDED,
  TOKEN_NOT_PROVIDED,
  INVALID_REFRESH_TOKEN,
  INVALID_TOKEN,
  USER_NOT_FOUND,
  USER_NOT_ACTIVE_MIDDLEWARE
} = require("@constants/errors/user")

const { AUTHENTICATION_ERROR_TYPE } = require("@constants/errors/shared/types")

const User = require("@models/user")

const authToken = tryCatch(async (req, res, next) => {
  const refreshTokenFromRequest =
    req.cookies[`${process.env.NODE_ENV === "production" ? "__Secure-" : ""}auth-refresh-token`]
  const accessTokenFromRequest =
    req.cookies[`${process.env.NODE_ENV === "production" ? "__Secure-" : ""}auth-access-token`]

  if (!refreshTokenFromRequest) {
    throw new AppError(
      401,
      REFRESH_TOKEN_NOT_PROVIDED,
      "Refresh token not provided",
      false,
      AUTHENTICATION_ERROR_TYPE
    )
  }
  if (!accessTokenFromRequest) {
    throw new AppError(
      401,
      TOKEN_NOT_PROVIDED,
      "Access token not provided",
      false,
      AUTHENTICATION_ERROR_TYPE
    )
  }

  await verifyRefreshToken(refreshTokenFromRequest)
  const user = await verifyAccessToken(accessTokenFromRequest)

  const existingUser = await User.findByUserId(user.id)
  if (existingUser.length <= 0) {
    throw new AppError(404, USER_NOT_FOUND, "User not found", true, AUTHENTICATION_ERROR_TYPE)
  }

  if (!existingUser[0].is_active) {
    throw new AppError(403, USER_NOT_ACTIVE_MIDDLEWARE, "User is not active", true, AUTHENTICATION_ERROR_TYPE)
  }

  req.user.id = Number(existingUser[0].id)

  next()
})

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error) => {
      if (error) {
        reject(
          new AppError(
            403,
            INVALID_REFRESH_TOKEN,
            "Invalid refresh token",
            false,
            AUTHENTICATION_ERROR_TYPE
          )
        )
      } else {
        resolve()
      }
    })
  })
}

const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        reject(
          new AppError(403, INVALID_TOKEN, "Invalid access token", false, AUTHENTICATION_ERROR_TYPE)
        )
      } else {
        resolve(user)
      }
    })
  })
}

module.exports = authToken
