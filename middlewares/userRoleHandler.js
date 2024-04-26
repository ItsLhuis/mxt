const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const { USER_NOT_FOUND, USER_NOT_AUTHENTICATED } = require("@constants/errors/user")

const User = require("@models/user")

const userRole = tryCatch(async (req, res, next) => {
  const userId = req.user.id

  if (!userId) {
    throw new AppError(401, USER_NOT_AUTHENTICATED, "User not authenticated", true)
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(404, USER_NOT_FOUND, "User not found", true)
  }

  req.user.role = user[0].role

  next()
})

module.exports = userRole
