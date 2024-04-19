const express = require("express")
const router = express.Router()

const authRouter = require("@routes/auth")
router.use("/auth", authRouter)

const userRouter = require("@routes/user")
router.use("/users", userRouter)

const employeeRouter = require("@routes/employee")
router.use("/employees", employeeRouter)

module.exports = router
