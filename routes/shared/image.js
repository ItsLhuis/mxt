const express = require("express")
const router = express.Router()

const imageController = require("@controllers/shared/image")

router.get("/:imageName", imageController.sendImage)

module.exports = router
