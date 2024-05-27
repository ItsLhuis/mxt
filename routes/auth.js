const express = require("express")
const router = express.Router()

const authController = require("@controllers/auth")

router.post("/login", authController.login)
router.post("/refreshToken", authController.refreshToken)
router.delete("/logout", authController.logout)

router.post("/resetPassword/request", authController.resetPassword.request)
router.post("/resetPassword/verify/:token", authController.resetPassword.verify)
router.post("/resetPassword/confirm/:token", authController.resetPassword.confirm)

module.exports = router
