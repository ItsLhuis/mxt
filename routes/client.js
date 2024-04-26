const express = require("express")
const router = express.Router()

const clientController = require("@controllers/client")

router.get("/", clientController.findAll)
router.post("/", clientController.create)
router.put("/:clientId", clientController.update)

module.exports = router
