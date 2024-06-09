const mapUser = (user) => {
  return {
    id: user.id,
    avatar: user.avatar,
    username: user.username,
    role: user.role
  }
}

module.exports = mapUser
