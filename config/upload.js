const multer = require("multer")
const { v4: uuidv4 } = require("uuid")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4()

    const extension = file.originalname.split(".").pop()
    const fileId = `${fileName}.${extension}`

    cb(null, fileId)

    req.fileId = fileId
  }
})

const upload = multer({ storage: storage })

module.exports = upload
