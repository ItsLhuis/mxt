const mapUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    role: user.role
  }
}

module.exports = mapUser
