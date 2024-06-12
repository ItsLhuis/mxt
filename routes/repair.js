const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const repairController = require("@controllers/repair")

router
  .route("/")
  .get(checkPermissionHandler("repair", permissions.READ), repairController.findAll)
  .post(checkPermissionHandler("repair", permissions.CREATE), repairController.create)

router
  .route("/:repairId")
  .get(checkPermissionHandler("repair", permissions.READ), repairController.findByRepairId)
  .put(checkPermissionHandler("repair", permissions.UPDATE), repairController.update)

module.exports = router
