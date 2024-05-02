const express = require("express")
const router = express.Router()

const clientController = require("@controllers/client")

router.get("/", clientController.findAll)
router.post("/", clientController.create)
router.put("/:clientId", clientController.update)
router.delete("/:clientId", clientController.delete)

router.get("/:clientId/contacts", clientController.contact.findAllByClientId)
router.post("/:clientId/contacts", clientController.contact.create)
router.put("/contacts/:contactId", clientController.contact.update)
router.delete("/contacts/:contactId", clientController.contact.delete)

router.get("/:clientId/addresses", clientController.address.findAllByClientId)
router.post("/:clientId/addresses", clientController.address.create)
router.put("/addresses/:addressId", clientController.address.update)
router.delete("/addresses/:addressId", clientController.address.delete)

router.get("/:clientId/interactionsHistory", clientController.interactionsHistory.findAllByClientId)

module.exports = router
