const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const clientController = require("@controllers/client")

router
  .route("/")
  .get(checkPermissionHandler("client", permissions.READ), clientController.findAll)
  .post(checkPermissionHandler("client", permissions.CREATE), clientController.create)

router
  .route("/analytics/summary")
  .get(checkPermissionHandler("client", permissions.READ), clientController.analytics.summary)

router
  .route("/analytics/activity/:year")
  .get(checkPermissionHandler("client", permissions.READ), clientController.analytics.activity)

router
  .route("/:clientId")
  .get(checkPermissionHandler("client", permissions.READ), clientController.findByClientId)
  .put(checkPermissionHandler("client", permissions.UPDATE), clientController.update)
  .delete(checkPermissionHandler("client", permissions.DELETE), clientController.delete)

router
  .route("/:clientId/contacts")
  .get(
    checkPermissionHandler("client.contact", permissions.READ),
    clientController.contact.findAllByClientId
  )
  .post(
    checkPermissionHandler("client.contact", permissions.CREATE),
    clientController.contact.create
  )

router
  .route("/:clientId/contacts/:contactId")
  .put(
    checkPermissionHandler("client.contact", permissions.UPDATE),
    clientController.contact.update
  )
  .delete(
    checkPermissionHandler("client.contact", permissions.DELETE),
    clientController.contact.delete
  )

router
  .route("/:clientId/addresses")
  .get(
    checkPermissionHandler("client.address", permissions.READ),
    clientController.address.findAllByClientId
  )
  .post(
    checkPermissionHandler("client.address", permissions.CREATE),
    clientController.address.create
  )

router
  .route("/:clientId/addresses/:addressId")
  .put(
    checkPermissionHandler("client.address", permissions.UPDATE),
    clientController.address.update
  )
  .delete(
    checkPermissionHandler("client.address", permissions.DELETE),
    clientController.address.delete
  )

router.get(
  "/:clientId/interactionsHistory",
  checkPermissionHandler("client.interactionsHistory", permissions.READ),
  clientController.interactionsHistory.findAllByClientId
)

module.exports = router
