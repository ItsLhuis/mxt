const express = require("express")
const router = express.Router()

const checkCompanyHandler = require("@middlewares/checkCompanyHandler")
const initializeUserHandler = require("@middlewares/initializeUserHandler")
const authTokenHandler = require("@middlewares/authTokenHandler")
const userRoleHandler = require("@middlewares/userRoleHandler")

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const { clearAllCaches, multiCache, memoryOnlyCache, diskOnlyCache } = require("@utils/cache")
router.delete(
  "/cache",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  checkPermissionHandler("cache", permissions.DELETE),
  (req, res) => {
    clearAllCaches([multiCache, memoryOnlyCache, diskOnlyCache])
      .then(() => res.send({ message: "Cache cleared successfully" }))
      .catch(() => {
        res.status(500).send({ message: "An error occurred while clearing the cache" })
      })
  }
)

const authRouter = require("@routes/auth")
router.use("/auth", initializeUserHandler, authRouter)

const companyRouter = require("@routes/company")
router.use("/company", initializeUserHandler, authTokenHandler, userRoleHandler, companyRouter)

const userRouter = require("@routes/user")
router.use(
  "/users",
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

const clientRouter = require("@routes/client")
router.use(
  "/clients",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  clientRouter
)

const emailRouter = require("@routes/email")
router.use(
  "/emails",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  emailRouter
)

const smsRouter = require("@routes/sms")
router.use(
  "/smses",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  smsRouter
)

const equipmentRouter = require("@routes/equipment")
router.use(
  "/equipments",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  equipmentRouter
)

const repairRouter = require("@routes/repair")
router.use(
  "/repairs",
  checkCompanyHandler,
  initializeUserHandler,
  authTokenHandler,
  userRoleHandler,
  repairRouter
)

module.exports = router
