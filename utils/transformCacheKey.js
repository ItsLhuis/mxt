const crypto = require("crypto")

const transformCacheKey = (cacheKey) => {
  return crypto.createHash("sha256").update(cacheKey).digest("hex")
}

module.exports = transformCacheKey