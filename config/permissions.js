const roles = require("@constants/roles")
const permissions = require("@constants/permissions")

module.exports = {
  client: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE],
    contact: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE]
    },
    address: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE]
    },
    interactionsHistory: {
      [roles.BOSS]: [permissions.READ],
      [roles.ADMIN]: [permissions.READ],
      [roles.EMPLOYEE]: [permissions.READ]
    }
  }
}
