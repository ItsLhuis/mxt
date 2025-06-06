const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const employeeController = require("@controllers/employee")

router
  .route("/")
  .get(checkPermissionHandler("employee", permissions.READ), employeeController.findAll)
  .put(checkPermissionHandler("employee", permissions.UPDATE), employeeController.update)

router
  .route("/analytics/summary")
  .get(checkPermissionHandler("employee", permissions.READ), employeeController.analytics.summary)

router
  .route("/analytics/activity/:year")
  .get(checkPermissionHandler("employee", permissions.READ), employeeController.analytics.activity)

router
  .route("/:userId")
  .get(checkPermissionHandler("employee", permissions.READ), employeeController.findByUserId)

module.exports = router
