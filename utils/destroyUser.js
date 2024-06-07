const destroyUser = async (req, res) => {
  req.user = null

  res.clearCookie(`${process.env.NODE_ENV === "production" ? "__Secure-" : ""}auth-refresh-token`)
  res.clearCookie(`${process.env.NODE_ENV === "production" ? "__Secure-" : ""}auth-access-token`)
}

module.exports = destroyUser
