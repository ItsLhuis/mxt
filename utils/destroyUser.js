const destroyUser = async (req, res) => {
  req.user = null

  req.session.refreshToken = null
  req.session.accessToken = null

  res.clearCookie("refreshToken")
  res.clearCookie("accessToken")
}

module.exports = destroyUser
