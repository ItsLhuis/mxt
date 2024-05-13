const express = require("express")
const router = express.Router()

const imageRouter = require("@routes/shared/image")
router.use("/images", imageRouter)

module.exports = router
