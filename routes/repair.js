const express = require("express")
const router = express.Router()

const checkPermissionHandler = require("@middlewares/checkPermissionHandler")
const permissions = require("@constants/permissions")
const repairController = require("@controllers/repair")

router
  .route("/status")
  .get(checkPermissionHandler("repair.status", permissions.READ), repairController.status.findAll)
  .post(checkPermissionHandler("repair.status", permissions.CREATE), repairController.status.create)

router
  .route("/status/:statusId")
  .get(
    checkPermissionHandler("repair.status", permissions.READ),
    repairController.status.findByStatusId
  )
  .put(checkPermissionHandler("repair.status", permissions.UPDATE), repairController.status.update)
  .delete(
    checkPermissionHandler("repair.status", permissions.DELETE),
    repairController.status.delete
  )

router
  .route("/entry-accessories")
  .get(
    checkPermissionHandler("repair.entryAccessory", permissions.READ),
    repairController.entryAccessory.findAll
  )
  .post(
    checkPermissionHandler("repair.entryAccessory", permissions.CREATE),
    repairController.entryAccessory.create
  )

router
  .route("/entry-accessories/:entryAccessoryId")
  .get(
    checkPermissionHandler("repair.entryAccessory", permissions.READ),
    repairController.entryAccessory.findByAccessoryId
  )
  .put(
    checkPermissionHandler("repair.entryAccessory", permissions.UPDATE),
    repairController.entryAccessory.update
  )
  .delete(
    checkPermissionHandler("repair.entryAccessory", permissions.DELETE),
    repairController.entryAccessory.delete
  )

router
  .route("/entry-reported-issues")
  .get(
    checkPermissionHandler("repair.entryReportedIssue", permissions.READ),
    repairController.entryReportedIssue.findAll
  )
  .post(
    checkPermissionHandler("repair.entryReportedIssue", permissions.CREATE),
    repairController.entryReportedIssue.create
  )

router
  .route("/entry-reported-issues/:entryReportedIssueId")
  .get(
    checkPermissionHandler("repair.entryReportedIssue", permissions.READ),
    repairController.entryReportedIssue.findByReportedIssueId
  )
  .put(
    checkPermissionHandler("repair.entryReportedIssue", permissions.UPDATE),
    repairController.entryReportedIssue.update
  )
  .delete(
    checkPermissionHandler("repair.entryReportedIssue", permissions.DELETE),
    repairController.entryReportedIssue.delete
  )

router
  .route("/intervention-works-done")
  .get(
    checkPermissionHandler("repair.interventionWorkDone", permissions.READ),
    repairController.interventionWorkDone.findAll
  )
  .post(
    checkPermissionHandler("repair.interventionWorkDone", permissions.CREATE),
    repairController.interventionWorkDone.create
  )

router
  .route("/intervention-works-done/:interventionWorkDoneId")
  .get(
    checkPermissionHandler("repair.interventionWorkDone", permissions.READ),
    repairController.interventionWorkDone.findByInterventionWorkDoneId
  )
  .put(
    checkPermissionHandler("repair.interventionWorkDone", permissions.UPDATE),
    repairController.interventionWorkDone.update
  )
  .delete(
    checkPermissionHandler("repair.interventionWorkDone", permissions.DELETE),
    repairController.interventionWorkDone.delete
  )

router
  .route("/intervention-accessories-used")
  .get(
    checkPermissionHandler("repair.interventionAccessoryUsed", permissions.READ),
    repairController.interventionAccessoryUsed.findAll
  )
  .post(
    checkPermissionHandler("repair.interventionAccessoryUsed", permissions.CREATE),
    repairController.interventionAccessoryUsed.create
  )

router
  .route("/intervention-accessories-used/:interventionAccessoryUsedId")
  .get(
    checkPermissionHandler("repair.interventionAccessoryUsed", permissions.READ),
    repairController.interventionAccessoryUsed.findByInterventionAccessoryUsedId
  )
  .put(
    checkPermissionHandler("repair.interventionAccessoryUsed", permissions.UPDATE),
    repairController.interventionAccessoryUsed.update
  )
  .delete(
    checkPermissionHandler("repair.interventionAccessoryUsed", permissions.DELETE),
    repairController.interventionAccessoryUsed.delete
  )

router
  .route("/")
  .get(checkPermissionHandler("repair", permissions.READ), repairController.findAll)
  .post(checkPermissionHandler("repair", permissions.CREATE), repairController.create)

router
  .route("/analytics/summary")
  .get(checkPermissionHandler("repair", permissions.READ), repairController.analytics.summary)

router
  .route("/:repairId")
  .get(checkPermissionHandler("repair", permissions.READ), repairController.findByRepairId)
  .put(checkPermissionHandler("repair", permissions.UPDATE), repairController.update)
  .delete(checkPermissionHandler("repair", permissions.DELETE), repairController.delete)

router
  .route("/:repairId/attachments")
  .post(
    checkPermissionHandler("repair.attachment", permissions.UPDATE),
    repairController.attachment.uploadAttachments,
    repairController.attachment.create
  )

router
  .route("/:repairId/attachments/:attachmentId")
  .delete(
    checkPermissionHandler("repair.attachment", permissions.DELETE),
    repairController.attachment.delete
  )

router
  .route("/:repairId/attachments/:attachmentId/:fileName")
  .get(
    checkPermissionHandler("repair.attachment", permissions.READ),
    repairController.attachment.sendAttachment
  )

router.get(
  "/:repairId/interactionsHistory",
  checkPermissionHandler("repair.interactionsHistory", permissions.READ),
  repairController.interactionsHistory.findByRepairId
)

module.exports = router
