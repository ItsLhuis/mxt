const mapUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
    is_active: Boolean(user.is_active)
  }
}

module.exports = mapUser
