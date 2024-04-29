const express = require("express")
const router = express.Router()

const userController = require("@controllers/user")

router.get("/", userController.findAll)
router.post("/", userController.create)
router.put("/:userId", userController.update)
router.put("/:userId/password", userController.updatePassword)
router.delete("/:userId", userController.delete)

module.exports = router
