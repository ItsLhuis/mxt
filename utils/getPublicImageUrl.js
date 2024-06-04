const getPublicImageUrl = (req, imageName) => {
  return `${req.protocol}://${req.get("host")}/resources/images/${imageName}`
}

module.exports = getPublicImageUrl
