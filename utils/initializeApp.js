const bcrypt = require("bcrypt")

const { SALT_ROUNDS } = require("@constants/bcrypt")
const { BOSS } = require("@constants/roles")

const User = require("@models/user")
const Company = require("@models/company")

const initializeApp = async () => {
  try {
    const users = await User.findAll()
    const bossUser = users.find((user) => user.role === BOSS)

    if (bossUser) {
      return
    }

    const hashedPassword = await bcrypt.hash("adminboss", SALT_ROUNDS)

    await User.create("Admin", hashedPassword, null, BOSS, 1)
    await Company.initialize()
  } catch (error) {
    console.error('Error initializing the "Boss" user and company')
    throw error
  }
}

module.exports = initializeApp
