const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const companyController = require("@controllers/company")

router
  .route("/")
  .get(checkPermissionHandler("company", permissions.READ), companyController.find)
  .put(
    checkPermissionHandler("company", permissions.UPDATE),
    companyController.uploadLogo,
    companyController.update
  )

router.route("/logo").get(companyController.findLogo)

module.exports = router
