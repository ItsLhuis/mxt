const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: "Oops! It feels like you got lost in unknown lands..." })
}

module.exports = notFoundHandler
