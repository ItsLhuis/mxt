const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const equipmentController = require("@controllers/equipment")

router
  .route("/types")
  .get(checkPermissionHandler("equipment.type", permissions.READ), equipmentController.type.findAll)
  .post(
    checkPermissionHandler("equipment.type", permissions.CREATE),
    equipmentController.type.create
  )

router
  .route("/types/:typeId")
  .get(
    checkPermissionHandler("equipment.type", permissions.READ),
    equipmentController.type.findByTypeId
  )
  .put(
    checkPermissionHandler("equipment.type", permissions.UPDATE),
    equipmentController.type.update
  )
  .delete(
    checkPermissionHandler("equipment.type", permissions.DELETE),
    equipmentController.type.delete
  )

router
  .route("/brands")
  .get(
    checkPermissionHandler("equipment.brand", permissions.READ),
    equipmentController.brand.findAll
  )
  .post(
    checkPermissionHandler("equipment.brand", permissions.CREATE),
    equipmentController.brand.create
  )

router
  .route("/brands/:brandId")
  .get(
    checkPermissionHandler("equipment.brand", permissions.READ),
    equipmentController.brand.findByBrandId
  )
  .put(
    checkPermissionHandler("equipment.brand", permissions.UPDATE),
    equipmentController.brand.update
  )
  .delete(
    checkPermissionHandler("equipment.brand", permissions.DELETE),
    equipmentController.brand.delete
  )

router
  .route("/models")
  .get(
    checkPermissionHandler("equipment.model", permissions.READ),
    equipmentController.model.findAll
  )
  .post(
    checkPermissionHandler("equipment.model", permissions.CREATE),
    equipmentController.model.create
  )

router
  .route("/models/:modelId")
  .get(
    checkPermissionHandler("equipment.model", permissions.READ),
    equipmentController.model.findByModelId
  )
  .put(
    checkPermissionHandler("equipment.model", permissions.UPDATE),
    equipmentController.model.update
  )
  .delete(
    checkPermissionHandler("equipment.model", permissions.DELETE),
    equipmentController.model.delete
  )

router
  .route("/models/brands/:brandId")
  .get(
    checkPermissionHandler("equipment.model", permissions.READ),
    equipmentController.model.findByBrandId
  )

router
  .route("/")
  .get(checkPermissionHandler("equipment", permissions.READ), equipmentController.findAll)
  .post(checkPermissionHandler("equipment", permissions.CREATE), equipmentController.create)

router
  .route("/:equipmentId")
  .get(checkPermissionHandler("equipment", permissions.READ), equipmentController.findByEquipmentId)
  .put(checkPermissionHandler("equipment", permissions.UPDATE), equipmentController.update)
  .delete(checkPermissionHandler("equipment", permissions.DELETE), equipmentController.delete)

router
  .route("/:equipmentId/client")
  .put(checkPermissionHandler("equipment", permissions.UPDATE), equipmentController.updateClientId)

router
  .route("/:equipmentId/attachments")
  .post(
    checkPermissionHandler("equipment.attachment", permissions.UPDATE),
    equipmentController.attachment.uploadAttachments,
    equipmentController.attachment.create
  )

router
  .route("/:equipmentId/attachments/:attachmentId")
  .delete(
    checkPermissionHandler("equipment.attachment", permissions.DELETE),
    equipmentController.attachment.delete
  )

router
  .route("/:equipmentId/attachments/:attachmentId/:fileName")
  .get(
    checkPermissionHandler("equipment.attachment", permissions.READ),
    equipmentController.attachment.sendAttachment
  )

router.get(
  "/:equipmentId/interactionsHistory",
  checkPermissionHandler("equipment.interactionsHistory", permissions.READ),
  equipmentController.interactionsHistory.findByEquipmentId
)

module.exports = router
