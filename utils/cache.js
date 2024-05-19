const Cache = require("@classes/cache")
const cache = new Cache({ memoryTTL: 5, diskTTL: 10 })

const withCache = (cacheKey, fetchDataFunction) => {
  return async () => {
    const cachedData = await cache.get(cacheKey)

    if (cachedData) {
      return Promise.resolve(cachedData)
    }

    return fetchDataFunction().then((data) => {
      cache.set(cacheKey, data)
      return data
    })
  }
}

const revalidateCache = (cacheKey) => {}

module.exports = { withCache, revalidateCache }
