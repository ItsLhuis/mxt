const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const smsController = require("@controllers/sms")

router
  .route("/")
  .get(checkPermissionHandler("sms", permissions.READ), smsController.findAll)
  .post(checkPermissionHandler("sms", permissions.CREATE), smsController.send)

router.route("/analytics/summary").get(checkPermissionHandler("sms", permissions.READ), smsController.analytics.summary)

router
  .route("/:smsId")
  .get(checkPermissionHandler("sms", permissions.READ), smsController.findBySmsId)

module.exports = router
