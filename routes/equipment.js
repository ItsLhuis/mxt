const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const equipmentController = require("@controllers/equipment")

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
  .route("/brand")
  .get(
    checkPermissionHandler("equipment.brand", permissions.READ),
    equipmentController.brand.findAll
  )
  .post(
    checkPermissionHandler("equipment.brand", permissions.CREATE),
    equipmentController.brand.create
  )

router
  .route("/brand/:brandId")
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
  .route("/model")
  .get(
    checkPermissionHandler("equipment.model", permissions.READ),
    equipmentController.model.findAll
  )
  .post(
    checkPermissionHandler("equipment.model", permissions.CREATE),
    equipmentController.model.create
  )

router
  .route("/model/:modelId")
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
  .route("/type")
  .get(checkPermissionHandler("equipment.type", permissions.READ), equipmentController.type.findAll)
  .post(
    checkPermissionHandler("equipment.type", permissions.CREATE),
    equipmentController.type.create
  )

router
  .route("/type/:typeId")
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
  .route("/:equipmentId/attachments")
  .post(
    checkPermissionHandler("equipment.attachment", permissions.UPDATE),
    equipmentController.attachment.uploadAttachments,
    equipmentController.attachment.create
  )

router
  .route("/:equipmentId/attachments/:attachmentId")
  .get(
    checkPermissionHandler("equipment.attachment", permissions.READ),
    equipmentController.attachment.sendAttachment
  )
  .delete(
    checkPermissionHandler("equipment.attachment", permissions.DELETE),
    equipmentController.attachment.delete
  )

module.exports = router
