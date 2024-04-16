const express = require("express")
const router = express.Router()

const authRouter = require("@routes/auth.routes")
router.use("/auth", authRouter)

module.exports = router
