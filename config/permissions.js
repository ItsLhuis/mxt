const roles = require("@constants/roles")
const permissions = require("@constants/permissions")

module.exports = {
  cache: {
    [roles.BOSS]: [permissions.DELETE],
    [roles.ADMIN]: [permissions.DELETE]
  },
  company: {
    [roles.BOSS]: [permissions.READ, permissions.UPDATE]
  },
  user: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.READ]
  },
  employee: {
    [roles.BOSS]: [permissions.READ, permissions.UPDATE],
    [roles.ADMIN]: [permissions.READ, permissions.UPDATE],
    [roles.EMPLOYEE]: [permissions.READ, permissions.UPDATE]
  },
  email: {
    [roles.BOSS]: [permissions.READ, permissions.CREATE],
    [roles.ADMIN]: [permissions.READ, permissions.CREATE],
    [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE]
  },
  sms: {
    [roles.BOSS]: [permissions.READ, permissions.CREATE],
    [roles.ADMIN]: [permissions.READ, permissions.CREATE],
    [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE]
  },
  client: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE, permissions.UPDATE],
    contact: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE, permissions.UPDATE]
    },
    address: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE, permissions.UPDATE]
    },
    interactionsHistory: {
      [roles.BOSS]: [permissions.READ],
      [roles.ADMIN]: [permissions.READ]
    }
  },
  equipment: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE, permissions.UPDATE],
    brand: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ]
    },
    model: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ]
    },
    type: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ]
    },
    attachment: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE]
    },
    interactionsHistory: {
      [roles.BOSS]: [permissions.READ],
      [roles.ADMIN]: [permissions.READ]
    }
  },
  repair: {
    [roles.BOSS]: [permissions.ALL],
    [roles.ADMIN]: [permissions.ALL],
    [roles.EMPLOYEE]: [permissions.READ, permissions.CREATE, permissions.UPDATE],
    status: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ]
    },
    entryAccessory: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ]
    },
    entryReportedIssue: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ]
    },
    interventionWorkDone: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ]
    },
    interventionAccessoryUsed: {
      [roles.BOSS]: [permissions.ALL],
      [roles.ADMIN]: [permissions.ALL],
      [roles.EMPLOYEE]: [permissions.READ]
    },
    attachment: {
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
