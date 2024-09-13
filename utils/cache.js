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
      if (Array.isArray(cacheKey)) {
        if (cacheInstance !== memoryOnlyCache) {
          throw new Error("Memory cache instance is required when using array cache keys.")
        }
      }

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

    if (
      cacheKeys.some((cacheKey) => Array.isArray(cacheKey)) &&
      !cacheInstances.includes(memoryOnlyCache)
    ) {
      throw new Error("Memory cache instance is required when using array cache keys.")
    }

    const nonArrayCacheKeys = cacheKeys.filter((key) => !Array.isArray(key))

    if (nonArrayCacheKeys.length > 0) {
      const invalidationPromises = cacheInstances.map(async (cacheInstance) => {
        const removalPromises = nonArrayCacheKeys.map(async (cacheKey) => {
          const transformedKey = transformCacheKey(cacheKey)
          await cacheInstance.del(transformedKey)
        })
        await Promise.all(removalPromises)
      })
      await Promise.all(invalidationPromises)
    }

    if (cacheInstances.includes(memoryOnlyCache)) {
      const memoryKeys = memoryOnlyCache.memoryCache.keys()
      const arrayCacheKeys = cacheKeys.filter((cacheKey) => Array.isArray(cacheKey))

      if (arrayCacheKeys.length > 0) {
        const memoryKeySet = new Set(memoryKeys)

        const matchingKeys = arrayCacheKeys.flatMap((arrayKey) => {
          return Array.from(memoryKeySet).filter((cacheKey) => {
            try {
              const parsedKey = JSON.parse(cacheKey)
              return arrayKey.every((element) => parsedKey.includes(element))
            } catch {
              return false
            }
          })
        })

        const invalidationPromises = cacheInstances.map(async (cacheInstance) => {
          const removalPromises = matchingKeys.map(async (key) => {
            await cacheInstance.del(key)
          })
          await Promise.all(removalPromises)
        })
        await Promise.all(invalidationPromises)
      }
    }
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
