const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const emailController = require("@controllers/email")

router
  .route("/")
  .get(checkPermissionHandler("email", permissions.READ), emailController.findAll)
  .post(checkPermissionHandler("email", permissions.CREATE), emailController.send)

router
  .route("/:emailId")
  .get(checkPermissionHandler("email", permissions.READ), emailController.findByEmailId)

module.exports = router
