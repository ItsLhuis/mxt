const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const smsController = require("@controllers/sms")

router.get("/", checkPermissionHandler("sms", permissions.READ), smsController.findAll)

router
  .route("/:smsId")
  .get(checkPermissionHandler("sms", permissions.READ), smsController.findBySmsId)

module.exports = router
