const { ZodError } = require("zod")
const AppError = require("@classes/app/error")

const errorHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      code: 400,
      message: "Validation Error",
      errors: error.errors
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      type: error.errorType,
      code: error.errorCode,
      message: error.errorMessage,
      isOperational: error.isOperational
    })
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(500).send(error.stack)
  }

  return res.status(500).send("Something went wrong!")
}

module.exports = errorHandler
