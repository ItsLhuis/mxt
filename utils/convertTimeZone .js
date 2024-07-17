const momentTz = require("moment-timezone")

const convertTimeZone = (dateSent, timeZone, format = "YYYY-MM-DD HH:mm:ss a") => {
  return momentTz.tz(dateSent, format, timeZone).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
}

module.exports = convertTimeZone
