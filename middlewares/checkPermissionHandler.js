const AppError = require("@classes/app/error")
const permissions = require("@config/permissions")

const { PERMISSION_DENIED } = require("@constants/errors/permission")

const { PERMISSION_DENIED_ERROR_TYPE } = require("@constants/errors/shared/types")

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
      throw new AppError(
        403,
        PERMISSION_DENIED,
        "You don't have permission to perform this action",
        true,
        PERMISSION_DENIED_ERROR_TYPE
      )
    }

    next()
  }
}

module.exports = checkPermission
