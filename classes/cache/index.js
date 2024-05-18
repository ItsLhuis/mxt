const zlib = require("zlib")

const NodeCache = require("node-cache")

const fs = require("fs")
const path = require("path")

const { isEqual } = require("lodash")

class Cache {
  constructor({ memoryTTL = 0, diskTTL = 0 } = {}) {
    this.memoryCache = new NodeCache({ stdTTL: memoryTTL })
    Object.defineProperty(this, "cacheDir", {
      value: "tmp/cache",
      writable: false,
      configurable: false,
      enumerable: true
    })
    this.memoryTTL = memoryTTL
    this.diskTTL = diskTTL

    if (this.diskTTL > 0) {
      const cleaningInterval = (this.diskTTL * 1000) / 2 + this.diskTTL * 1000 * 0.1

      setInterval(() => {
        this.clearExpiredDiskCache()
      }, cleaningInterval)
    }
  }

  set(key, data) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.cacheDir, key)

      fs.promises
        .readFile(filePath)
        .then((existingData) => {
          let parsedExistingData
          try {
            parsedExistingData = zlib.gunzipSync(existingData).toString()
          } catch (error) {
            parsedExistingData = "[]"
            fs.promises.unlink(filePath)
          }

          let currentData = []
          try {
            currentData = JSON.parse(parsedExistingData)
          } catch (error) {
            currentData = []
            fs.promises.unlink(filePath)
          }

          const newData = Array.isArray(data) ? data : [data]
          const uniqueData = newData.filter(
            (newItem) => !currentData.some((existingItem) => isEqual(existingItem, newItem))
          )

          if (uniqueData.length > 0) {
            currentData.push(...uniqueData)

            const serializedData = zlib.gzipSync(JSON.stringify(currentData), {
              level: zlib.constants.Z_BEST_COMPRESSION
            })

            return fs.promises.writeFile(filePath, serializedData)
          } else {
            this.memoryCache.set(key, currentData, this.memoryTTL)
            return resolve()
          }
        })
        .catch((error) => {
          if (error.code === "ENOENT") {
            const serializedData = zlib.gzipSync(
              JSON.stringify(Array.isArray(data) ? data : [data]),
              {
                level: zlib.constants.Z_BEST_COMPRESSION
              }
            )
            return fs.promises.writeFile(filePath, serializedData)
          }
          throw error
        })
        .then(() => {
          const memoryData = this.memoryCache.get(key) || []

          const newData = Array.isArray(data) ? data : [data]
          const uniqueData = newData.filter(
            (item) => !memoryData.some((existingItem) => isEqual(existingItem, item))
          )

          if (uniqueData.length > 0) {
            memoryData.push(...uniqueData)
          }

          this.memoryCache.set(key, memoryData, this.memoryTTL)
          resolve()
        })
        .catch((error) => reject(error))
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      const memoryData = this.memoryCache.get(key)
      if (memoryData !== undefined) {
        return resolve(memoryData)
      }

      const filePath = path.join(this.cacheDir, key)

      fs.promises
        .readFile(filePath)
        .then((data) => {
          let parsedData
          try {
            parsedData = JSON.parse(zlib.gunzipSync(data).toString())
          } catch (error) {
            parsedData = null
            fs.promises.unlink(filePath)
          }

          if (parsedData) {
            this.memoryCache.set(key, parsedData, this.memoryTTL)
          }
          resolve(parsedData === null ? [] : parsedData)
        })
        .catch((error) => {
          if (error.code === "ENOENT") {
            resolve([])
          } else {
            reject(error)
          }
        })
    })
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.cacheDir, key)
      fs.promises
        .access(filePath, fs.constants.F_OK)
        .then(() => {
          this.memoryCache.del(key)
          return fs.promises.unlink(filePath)
        })
        .then(() => resolve())
        .catch((error) => {
          if (error.code === "ENOENT") {
            resolve()
          } else {
            reject(error)
          }
        })
    })
  }

  clear() {
    return new Promise((resolve, reject) => {
      fs.promises
        .readdir(this.cacheDir)
        .then((files) => {
          const promises = files.map((file) => fs.promises.unlink(path.join(this.cacheDir, file)))
          return Promise.all(promises)
        })
        .then(() => {
          this.memoryCache.flushAll()
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  clearExpiredDiskCache() {
    if (this.diskTTL === 0) {
      return
    }

    const now = Date.now()
    fs.readdir(this.cacheDir, (err, files) => {
      if (err) throw err

      files.forEach((file) => {
        const filePath = path.join(this.cacheDir, file)

        fs.stat(filePath, (err, stats) => {
          if (err) throw err

          const fileAgeSeconds = Math.floor((now - stats.mtime.getTime()) / 1000)

          if (fileAgeSeconds > this.diskTTL) {
            fs.unlink(filePath, (err) => {
              if (err) throw err
            })
          }
        })
      })
    })
  }
}

module.exports = Cache
