const Cache = require("@classes/cache")
const multiCache = new Cache({ memoryTTL: 900, diskTTL: 43200, storage: "both" })
const memoryOnlyCache = new Cache({ memoryTTL: 1800, storage: "memory" })
const diskOnlyCache = new Cache({ diskTTL: 3600, storage: "disk", cacheDir: "files" })

const transformCacheKey = require("@utils/transformCacheKey")

const { CACHE_ENABLED } = require("@constants/config")

const withCache = (cacheKey, fetchDataFunction, cacheInstance = multiCache) => {
  return async () => {
    const transformedKey = transformCacheKey(cacheKey)

    if (CACHE_ENABLED) {
      try {
        const cachedData = await cacheInstance.get(transformedKey)

        if (cachedData) {
          return Promise.resolve(cachedData)
        }
      } catch (error) {}
    }

    return fetchDataFunction().then((data) => {
      if (CACHE_ENABLED) {
        if (data && (!Array.isArray(data) || (Array.isArray(data) && data.length > 0))) {
          cacheInstance.set(transformedKey, data)
        }
      }
      return data
    })
  }
}

const revalidateCache = async (
  cacheKeys,
  cacheInstances = [multiCache, memoryOnlyCache, diskOnlyCache]
) => {
  if (CACHE_ENABLED) {
    if (!Array.isArray(cacheKeys)) {
      cacheKeys = [cacheKeys]
    }

    const invalidationPromises = cacheInstances.map(async (cacheInstance) => {
      const removalPromises = cacheKeys.map(async (cacheKey) => {
        const transformedKey = transformCacheKey(cacheKey)
        await cacheInstance.del(transformedKey)
      })
      await Promise.all(removalPromises)
    })
    await Promise.all(invalidationPromises)
  }
}

const clearAllCaches = async (cacheInstances = [multiCache, memoryOnlyCache, diskOnlyCache]) => {
  if (CACHE_ENABLED) {
    const clearPromises = cacheInstances.map(async (cacheInstance) => {
      await cacheInstance.clear()
    })
    await Promise.all(clearPromises)
  }
}

module.exports = {
  withCache,
  revalidateCache,
  clearAllCaches,
  multiCache,
  memoryOnlyCache,
  diskOnlyCache
}
