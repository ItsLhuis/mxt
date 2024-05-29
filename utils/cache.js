const Cache = require("@classes/cache")
const multiCache = new Cache({ memoryTTL: 900, diskTTL: 43200, storage: "both" })
const memoryOnlyCache = new Cache({ memoryTTL: 1800, storage: "memory" })

const { CACHE_ENABLED } = require("@constants/config")

const withCache = (cacheKey, fetchDataFunction, cacheInstance = multiCache) => {
  return async () => {
    if (CACHE_ENABLED) {
      try {
        const cachedData = await cacheInstance.get(cacheKey)

        if (cachedData) {
          return Promise.resolve(cachedData)
        }
      } catch (error) {}
    }

    return fetchDataFunction().then((data) => {
      if (CACHE_ENABLED) {
        if (data && (!Array.isArray(data) || (Array.isArray(data) && data.length > 0))) {
          cacheInstance.set(cacheKey, data)
        }
      }
      return data
    })
  }
}

const revalidateCache = async (cacheKeys, cacheInstances = [multiCache, memoryOnlyCache]) => {
  if (CACHE_ENABLED) {
    if (!Array.isArray(cacheKeys)) {
      cacheKeys = [cacheKeys]
    }

    const invalidationPromises = cacheInstances.map(async (cacheInstance) => {
      const removalPromises = cacheKeys.map(async (cacheKey) => {
        await cacheInstance.del(cacheKey)
      })
      await Promise.all(removalPromises)
    })
    await Promise.all(invalidationPromises)
  }
}

module.exports = { withCache, revalidateCache, multiCache, memoryOnlyCache }
