const Cache = require("@classes/cache")

const diskAndMemoryCache = new Cache({ memoryTTL: 30, diskTTL: 60, storage: "both" })
const memoryOnlyCache = new Cache({ memoryTTL: 30, storage: "memory" })

const withCache = (cacheKey, fetchDataFunction, storageType = "both") => {
  let cacheInstance

  switch (storageType.toLowerCase().trim()) {
    case "memory":
      cacheInstance = memoryOnlyCache
      break
    case "both":
    default:
      cacheInstance = diskAndMemoryCache
      break
  }

  return async () => {
    const cachedData = await cacheInstance.get(cacheKey)

    if (cachedData) {
      return Promise.resolve(cachedData)
    }

    return fetchDataFunction().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        cacheInstance.set(cacheKey, data)
      }
      return data
    })
  }
}

const revalidateCache = (cacheKey) => {}

module.exports = { withCache, revalidateCache }
