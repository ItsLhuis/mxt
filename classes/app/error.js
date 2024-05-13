const { APP_ERROR_TYPE } = require("@constants/errors/shared/types")

class AppError extends Error {
  constructor(statusCode, errorCode, message, isOperational = false, errorType = APP_ERROR_TYPE) {
    super(message)
    this.statusCode = statusCode
    this.errorType = errorType
    this.errorCode = errorCode
    this.errorMessage = message
    this.isOperational = isOperational
  }
}

module.exports = AppError
