const express = require("express")
const router = express.Router()

const userController = require("@controllers/user")

router.get("/", userController.findAll)
router.post("/", userController.create)
router.put("/:id", userController.update)
router.put("/:id/password", userController.updatePassword)
router.delete("/:id", userController.delete)

module.exports = router
