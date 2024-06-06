const express = require("express")
const router = express.Router()

const checkCompanyHandler = require("@middlewares/checkCompanyHandler")
const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const companyController = require("@controllers/company")

router
  .route("/")
  .get(checkPermissionHandler("company", permissions.READ), companyController.find)
  .put(
    checkPermissionHandler("employee", permissions.UPDATE),
    companyController.uploadLogo,
    companyController.update
  )

router.route("/logo").get(checkCompanyHandler, companyController.findLogo)

module.exports = router
