const { ZodError } = require("zod")
const AppError = require("@classes/app/error")
const { MulterError } = require("multer")

const {
  INTERNAL_SERVER_ERROR_TYPE,
  VALIDATION_ERROR_TYPE,
  FILE_ERROR_TYPE
} = require("@constants/errors/shared/types")

const errorHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        type: VALIDATION_ERROR_TYPE,
        code: 400,
        message: "Validation error",
        errors: error.errors
      }
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode ?? 400).json({
      error: {
        type: error.errorType,
        code: error.errorCode,
        message: error.errorMessage,
        isOperational: error.isOperational
      }
    })
  }

  if (error instanceof MulterError) {
    return res.status(500).json({
      error: {
        type: FILE_ERROR_TYPE,
        message: error.message,
        field: error.field,
        isOperational: false
      }
    })
  }

  console.error({
    type: INTERNAL_SERVER_ERROR_TYPE,
    code: "INT-001",
    message: "Internal Server Error",
    stack: error.stack
  })

  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      error: {
        type: INTERNAL_SERVER_ERROR_TYPE,
        code: "INT-001",
        message: "Something went wrong!",
        stack: error.stack
      }
    })
  }

  return res.status(500).json({
    error: {
      type: INTERNAL_SERVER_ERROR_TYPE,
      code: "INT-001",
      message: "Something went wrong!"
    }
  })
}

module.exports = errorHandler
