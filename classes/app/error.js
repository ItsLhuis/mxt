class AppError extends Error {
    constructor(statusCode, errorCode, message, isOperational = false) {
      super(message)
      this.statusCode = statusCode
      this.errorCode = errorCode
      this.errorMessage = message
      this.isOperational = isOperational
    }
  }
  
  module.exports = AppError
  