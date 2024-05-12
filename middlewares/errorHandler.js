const { ZodError } = require("zod")
const AppError = require("@classes/app/error")

const errorHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        type: "ValidationError",
        code: 400,
        message: "Validation error",
        errors: error.errors
      }
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        type: error.errorType,
        code: error.errorCode,
        message: error.errorMessage,
        isOperational: error.isOperational
      }
    })
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      error: {
        type: "InternalServer",
        code: 500,
        message: "Something went wrong!",
        stack: error.stack
      }
    })
  }

  return res.status(500).json({
    error: {
      type: "InternalServer",
      code: 500,
      message: "Something went wrong!"
    }
  })
}

module.exports = errorHandler
