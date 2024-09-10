const momentTz = require("moment-timezone")

const convertTimeZone = (dateSent, timeZone, format = "YYYY-MM-DD HH:mm:ss a") => {
  if (!dateSent || !timeZone) {
    return null
  }

  const momentDate = momentTz.tz(dateSent, format, timeZone)

  if (!momentDate.isValid()) {
    return null
  }

  return momentDate.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
}

module.exports = convertTimeZone
