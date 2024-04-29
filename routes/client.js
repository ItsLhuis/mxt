const express = require("express")
const router = express.Router()

const clientController = require("@controllers/client")

router.get("/", clientController.findAll)
router.post("/", clientController.create)
router.put("/:clientId", clientController.update)
router.delete("/:clientId", clientController.delete)

router.get("/:clientId/contacts", clientController.findAllContactsByClientId)
router.post("/:clientId/contacts", clientController.createContact)
router.put("/contacts/:contactId", clientController.updateContact)
router.delete("/contacts/:contactId", clientController.deleteContact)

router.get("/:clientId/addresses", clientController.findAllAddressesByClientId)
router.post("/:clientId/addresses", clientController.createAddress)
router.put("/addresses/:addressId", clientController.updateAddress)
router.delete("/addresses/:addressId", clientController.deleteAddress)

module.exports = router
