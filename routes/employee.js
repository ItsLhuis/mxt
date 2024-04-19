const express = require("express")
const router = express.Router()

const employeeController = require("@controllers/employee")

router.get("/", employeeController.findAll)
router.put("/:userId", employeeController.update)

module.exports = router
