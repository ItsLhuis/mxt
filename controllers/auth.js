const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const AppError = require("@classes/app/error")
const { tryCatch } = require("@utils/tryCatch")

const destroyUser = require("@utils/destroyUser")
const mailer = require("@utils/mailer")
const generateOtp = require("@utils/generateOtp")
const formatPhoneNumber = require("@utils/formatPhoneNumber")

const {
  AUTHENTICATION_FAILED,
  INVALID_REFRESH_TOKEN,
  USER_NOT_ACTIVE,
  USER_NOT_FOUND,
  INVALID_OTP_CODE,
  INVALID_RESET_PASSWORD_CODE
} = require("@constants/errors/user")
const { EMAIL_SEND_ERROR } = require("@constants/errors/shared/email")

const { AUTHENTICATION_ERROR_TYPE, EMAIL_ERROR_TYPE } = require("@constants/errors/shared/types")

const { SALT_ROUNDS } = require("@constants/bcrypt")

const generateAccessToken = require("@utils/generateAccessToken")

const User = require("@models/user")
const { authSchema, resetPassword } = require("@schemas/user")

const Company = require("@models/company")

const generateUniqueOtp = async () => {
  let otp = generateOtp()
  let existingOtp = await User.otpCode.findByOtpCode(otp)

  while (existingOtp.length > 0) {
    otp = generateOtp()
    existingOtp = await User.otpCode.findByOtpCode(otp)
  }

  return otp
}

const verifyResetPasswordToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        reject(new AppError(403, INVALID_RESET_PASSWORD_CODE, "Invalid or expired token", false))
      } else {
        resolve(decoded)
      }
    })
  })
}

const cookieOptions = {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
  maxAge: process.env.REFRESH_TOKEN_EXPIRES_IN * 1000
}

const authController = {
  login: tryCatch(async (req, res) => {
    const { username, password } = req.body

    authSchema.parse(req.body)

    const existingUser = await User.findByUsername(username)
    if (existingUser.length === 0) {
      throw new AppError(401, AUTHENTICATION_FAILED, "Invalid username or password", true)
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser[0].password)
    if (!isPasswordMatch) {
      throw new AppError(401, AUTHENTICATION_FAILED, "Invalid username or password", true)
    }

    if (!existingUser[0].is_active) {
      throw new AppError(403, USER_NOT_ACTIVE, "User is not active", true)
    }

    const refreshToken = jwt.sign({ id: existingUser[0].id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN)
    })

    const accessToken = generateAccessToken(refreshToken)

    res.cookie(
      `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}auth-refresh-token`,
      refreshToken,
      cookieOptions
    )
    res.cookie(
      `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}auth-access-token`,
      accessToken,
      {
        ...cookieOptions,
        maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000
      }
    )

    res.status(200).json({ message: "Authentication successful", token: accessToken })
  }),
  refreshToken: tryCatch(async (req, res) => {
    const refreshToken =
      req.cookies[`${process.env.NODE_ENV === "production" ? "__Secure-" : ""}auth-refresh-token`]

    if (!refreshToken) {
      throw new AppError(
        400,
        INVALID_REFRESH_TOKEN,
        "Refresh token is missing",
        false,
        AUTHENTICATION_ERROR_TYPE
      )
    }

    const newAccessToken = generateAccessToken(refreshToken)

    res.cookie(
      `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}auth-access-token`,
      newAccessToken,
      {
        ...cookieOptions,
        maxAge: process.env.ACCESS_TOKEN_EXPIRES_IN * 1000
      }
    )

    res.status(200).json({ message: "Reauthentication successful" })
  }),
  logout: tryCatch(async (req, res) => {
    await destroyUser(req, res)

    res.status(200).json({ message: "Logout successful" })
  }),
  resetPassword: {
    request: tryCatch(async (req, res) => {
      const { email } = req.body

      resetPassword.requestSchema.parse(req.body)

      const existingUser = await User.findByEmail(email)
      if (existingUser.length <= 0) {
        throw new AppError(404, USER_NOT_FOUND, "User with this e-mail not found", true)
      }

      const companyDetails = await Company.find()

      await User.otpCode.deleteUnusedByUserId(existingUser[0].id)

      const otpCode = await generateUniqueOtp()
      const userOtpCode = await User.otpCode.create(existingUser[0].id, otpCode)

      const resetPasswordToken = jwt.sign(
        { email: existingUser[0].email },
        process.env.RESET_PASSWORD_TOKEN_SECRET,
        {
          expiresIn: Number(process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN)
        }
      )

      await mailer
        .send(
          companyDetails[0].name,
          email,
          `Código de Verificação - ${otpCode}`,
          `O seu código de verificação é - ${otpCode}`,
          {
            username: existingUser[0].username,
            otpCode: otpCode,
            companyName: companyDetails[0].name,
            companyAddress: `${companyDetails[0].address}, ${companyDetails[0].postal_code}`,
            companyCity: companyDetails[0].city,
            companyCountry: companyDetails[0].country,
            companyPhoneNumber: formatPhoneNumber(companyDetails[0].phone_number),
            companyEmail: companyDetails[0].email,
            companyWebsite: companyDetails[0].website
          },
          "resetPassword"
        )
        .then(() => {
          res
            .status(200)
            .json({ message: "Reset password e-mail sent successfully", token: resetPasswordToken })
        })
        .catch(async () => {
          await User.otpCode.delete(userOtpCode.insertId)

          throw new AppError(
            500,
            EMAIL_SEND_ERROR,
            "An error occurred while sending the reset password e-mail",
            true,
            EMAIL_ERROR_TYPE
          )
        })
    }),
    verify: tryCatch(async (req, res) => {
      const { token } = req.params
      const { otp } = req.body

      resetPassword.verifySchema.parse(req.body)

      const decoded = await verifyResetPasswordToken(token)
      const email = decoded.email

      const existingUser = await User.findByEmail(email)
      if (existingUser.length <= 0) {
        throw new AppError(404, USER_NOT_FOUND, "User with this e-mail not found", true)
      }

      const validOtp = await User.otpCode.findByOtpCodeAndUserId(otp, existingUser[0].id)
      if (validOtp.length <= 0) {
        throw new AppError(400, INVALID_OTP_CODE, "Invalid or expired otp code", true)
      }

      const resetPasswordToken = jwt.sign(
        { id: existingUser[0].id, otp },
        process.env.RESET_PASSWORD_TOKEN_SECRET,
        {
          expiresIn: Number(process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN)
        }
      )

      res.status(200).json({ message: "Otp code verified successfully", token: resetPasswordToken })
    }),
    confirm: tryCatch(async (req, res) => {
      const { token } = req.params
      const { newPassword } = req.body

      resetPassword.confirmSchema.parse(req.body)

      const decoded = await verifyResetPasswordToken(token)
      const userId = decoded.id
      const otp = decoded.otp

      const existingUser = await User.findByUserId(userId)
      if (existingUser.length <= 0) {
        throw new AppError(404, USER_NOT_FOUND, "User not found", true)
      }

      const validOtp = await User.otpCode.findByOtpCodeAndUserId(otp, existingUser[0].id)
      if (validOtp.length <= 0) {
        throw new AppError(400, INVALID_OTP_CODE, "Invalid or expired otp code", true)
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
      await User.updatePassword(userId, hashedNewPassword)

      await User.otpCode.markAsUsed(otp)
      res.status(200).json({ message: "Password reset successfully" })
    })
  }
}

module.exports = authController
