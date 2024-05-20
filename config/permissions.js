const roles = require("@constants/roles")
const permissions = require("@constants/permissions")

module.exports = {
  user: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.UPDATE]
  },
  employee: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.UPDATE]
  },
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
      [roles.ADMIN]: [permissions.READ]
    }
  }
}
