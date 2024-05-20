const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const employeeController = require("@controllers/employee")

router.get("/", checkPermissionHandler("employee", permissions.READ), employeeController.findAll)

router
  .route("/:userId")
  .get(checkPermissionHandler("employee", permissions.READ), employeeController.findByUserId)
  .put(checkPermissionHandler("employee", permissions.UPDATE), employeeController.update)

module.exports = router
