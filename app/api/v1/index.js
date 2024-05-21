const express = require("express")
const router = express.Router()

const checkCompanyHandler = require("@middlewares/checkCompanyHandler")
const initializeUserHandler = require("@middlewares/initializeUserHandler")
const authTokenHandler = require("@middlewares/authTokenHandler")
const userRoleHandler = require("@middlewares/userRoleHandler")

const authRouter = require("@routes/auth")
router.use("/auth", initializeUserHandler, authRouter)

//----------------------------------------------------------------------------------------------------------

const companyRouter = require("@routes/company")
router.use("/company", initializeUserHandler, authTokenHandler, userRoleHandler, companyRouter)

//----------------------------------------------------------------------------------------------------------

const userRouter = require("@routes/user")
router.use(
  "/users",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  userRouter
)

const employeeRouter = require("@routes/employee")
router.use(
  "/employees",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  employeeRouter
)

//----------------------------------------------------------------------------------------------------------

const clientRouter = require("@routes/client")
router.use(
  "/clients",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  clientRouter
)

module.exports = router
