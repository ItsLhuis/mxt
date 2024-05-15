const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const userController = require("@controllers/user")

router
  .route("/")
  .get(checkPermissionHandler("user", permissions.READ), userController.findAll)
  .post(
    checkPermissionHandler("user", permissions.CREATE),
    userController.uploadAvatar,
    userController.create
  )
router
  .route("/:userId")
  .put(
    checkPermissionHandler("user", permissions.UPDATE),
    userController.uploadAvatar,
    userController.update
  )
  .delete(checkPermissionHandler("user", permissions.DELETE), userController.delete)
router.put(
  "/:userId/password",
  checkPermissionHandler("user", permissions.UPDATE),
  userController.updatePassword
)

module.exports = router
