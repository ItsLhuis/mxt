const express = require("express")
const router = express.Router()

const authController = require("@controllers/auth")

router.post("/login", authController.login)
router.post("/refreshToken", authController.refreshToken)
router.delete("/logout", authController.logout)

router.post("/reset-password/request", authController.resetPassword.request)
router.post("/reset-password/verify/:token", authController.resetPassword.verify)
router.post("/reset-password/confirm/:token", authController.resetPassword.confirm)

module.exports = router
