const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const equipmentController = require("@controllers/equipment")

router
  .route("/")
  .get(checkPermissionHandler("equipment", permissions.READ), equipmentController.findAll)
  .post(checkPermissionHandler("equipment", permissions.CREATE), equipmentController.create)

module.exports = router
