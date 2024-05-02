const express = require("express")
const router = express.Router()

const initializeUserHandler = require("@middlewares/initializeUserHandler")
const authTokenHandler = require("@middlewares/authTokenHandler")
const userRoleHandler = require("@middlewares/userRoleHandler")

const authRouter = require("@routes/auth")
router.use("/auth", initializeUserHandler, authRouter)

//----------------------------------------------------------------------------------------------------------

const userRouter = require("@routes/user")
router.use("/users", initializeUserHandler, authTokenHandler, userRoleHandler, userRouter)

const employeeRouter = require("@routes/employee")
router.use("/employees", initializeUserHandler, authTokenHandler, userRoleHandler, employeeRouter)

//----------------------------------------------------------------------------------------------------------

const clientRouter = require("@routes/client")
router.use("/clients", initializeUserHandler, authTokenHandler, userRoleHandler, clientRouter)

module.exports = router
