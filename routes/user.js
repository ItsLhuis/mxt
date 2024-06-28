const express = require("express")
const router = express.Router()

const checkCompanyHandler = require("@middlewares/checkCompanyHandler")
const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const userController = require("@controllers/user")

const applyCompanyCheck = (req, res, next) => {
  if (req.path !== "/profile") {
    return checkCompanyHandler(req, res, next)
  }
  next()
}

router.use(applyCompanyCheck)

router
  .route("/")
  .get(checkPermissionHandler("user", permissions.READ), userController.findAll)
  .post(checkPermissionHandler("user", permissions.CREATE), userController.create)

router.route("/profile").get(userController.findProfile).put(userController.updateProfile)

router.route("/profile/avatar").put(userController.uploadAvatar, userController.updateProfileAvatar)

router
  .route("/:userId")
  .get(checkPermissionHandler("user", permissions.READ), userController.findByUserId)
  .put(checkPermissionHandler("user", permissions.UPDATE), userController.update)
  .delete(checkPermissionHandler("user", permissions.DELETE), userController.delete)

router.put(
  "/:userId/password",
  checkPermissionHandler("user", permissions.UPDATE),
  userController.updatePassword
)

router.route("/:userId/avatar").get(userController.findAvatarByUserId)

module.exports = router
