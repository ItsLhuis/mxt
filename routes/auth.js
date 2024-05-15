const express = require("express")
const router = express.Router()

const authController = require("@controllers/auth")

router.post("/login", authController.login)
router.post("/refreshToken", authController.refreshToken)
router.delete("/logout", authController.logout)

router.post("/resetPassword/request", authController.requestResetPassword)
router.post("/resetPassword/verify", authController.verifyResetPassword)
router.post("/resetPassword/confirm", authController.confirmResetPassword)

module.exports = router
