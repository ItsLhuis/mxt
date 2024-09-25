const bcrypt = require("bcrypt")

const { SALT_ROUNDS } = require("@constants/bcrypt")
const { BOSS } = require("@constants/roles")

const User = require("@models/user")
const Employee = require("@models/employee")
const Company = require("@models/company")

const initializeApp = async () => {
  try {
    const company = await Company.find()
    if (company.length <= 0) {
      await Company.initialize()
    }

    const hasBossRole = await User.hasBossRole()
    if (!hasBossRole) {
      const hashedPassword = await bcrypt.hash("adminboss", SALT_ROUNDS)

      const bossUser = await User.create("Admin", hashedPassword, null, BOSS, 1)
      await Employee.create(bossUser.insertId)
    }
  } catch (error) {
    console.error("Error initializing the app")
    throw error
  }
}

module.exports = initializeApp
