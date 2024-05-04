class AppError extends Error {
  constructor(statusCode, errorCode, message, isOperational = false, errorType = "Error") {
    super(message)
    this.statusCode = statusCode
    this.errorType = errorType
    this.errorCode = errorCode
    this.errorMessage = message
    this.isOperational = isOperational
  }
}

module.exports = AppError
