const crypto = require("crypto")

const transformCacheKey = (cacheKey) => {
  if (Array.isArray(cacheKey)) {
    return JSON.stringify(cacheKey)
  } 

  return crypto.createHash("sha256").update(cacheKey).digest("hex")
}

module.exports = transformCacheKey
