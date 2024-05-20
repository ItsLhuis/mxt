const Cache = require("@classes/cache")
const multiCache = new Cache({ memoryTTL: 60, diskTTL: 120, storage: "both" })
const memoryOnlyCache = new Cache({ memoryTTL: 30, storage: "memory" })

const withCache = (cacheKey, fetchDataFunction, cacheInstance = multiCache) => {
  return async () => {
    try {
      const cachedData = await cacheInstance.get(cacheKey)

      if (cachedData) {
        return Promise.resolve(cachedData)
      }
    } catch (error) {}

    return fetchDataFunction().then((data) => {
      if (data && (!Array.isArray(data) || (Array.isArray(data) && data.length > 0))) {
        cacheInstance.set(cacheKey, data)
      }
      return data
    })
  }
}

const revalidateCache = async (cacheKeys, cacheInstances = [multiCache, memoryOnlyCache]) => {
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

module.exports = { withCache, revalidateCache, multiCache, memoryOnlyCache }
