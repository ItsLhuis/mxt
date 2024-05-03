const express = require("express")
const router = express.Router()

const userController = require("@controllers/user")

router.route("/").get(userController.findAll).post(userController.create)
router.route("/:userId").put(userController.update).delete(userController.delete)
router.put("/:userId/password", userController.updatePassword)

module.exports = router
