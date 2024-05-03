const AppError = require("@classes/app/error")
const permissions = require("@config/permissions")

const checkPermission = (entity, action) => {
  return (req, res, next) => {
    const role = req.user.role

    const checkNestedPermission = (entity, action) => {
      const entityParts = entity.split(".")

      let permission = permissions

      for (const entityPart of entityParts) {
        if (permission && permission[entityPart]) {
          permission = permission[entityPart]
        } else {
          return false
        }
      }

      if (permission[role] && permission[role].includes("*")) {
        return true
      }

      return permission[role] && permission[role].includes(action)
    }

    if (!checkNestedPermission(entity, action)) {
      throw new AppError(403, 1000, "You don't have permission to perform this action", true)
    }

    next()
  }
}

module.exports = checkPermission
