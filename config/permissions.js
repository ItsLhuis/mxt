const roles = require("@constants/roles")
const permissions = require("@constants/permissions")

module.exports = {
  company: {
    [roles.BOSS]: [permissions.READ, permissions.UPDATE]
  },
  user: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.READ, permissions.UPDATE]
  },
  employee: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.READ, permissions.UPDATE]
  },
  email: {
    [roles.BOSS]: [permissions.READ, permissions.CREATE],
    [roles.ADMIN]: [permissions.READ, permissions.CREATE],
    [roles.EMPLOYEE]: [permissions.READ]
  },
  sms: {
    [roles.BOSS]: [permissions.READ, permissions.CREATE],
    [roles.ADMIN]: [permissions.READ, permissions.CREATE],
    [roles.EMPLOYEE]: [permissions.READ]
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
