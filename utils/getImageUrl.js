const getImageUrl = (req, imageName) => {
  return `${req.protocol}://${req.get("host")}/api/v1/images/${imageName}`
}

module.exports = getImageUrl
