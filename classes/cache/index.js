const zlib = require("zlib")

const NodeCache = require("node-cache")

const fs = require("fs")
const path = require("path")

class Cache {
  constructor({ memoryTTL = 0, diskTTL = 0, storage = "both" } = {}) {
    this.memoryCache = new NodeCache({ stdTTL: memoryTTL })
    this.memoryTTL = memoryTTL
    Object.defineProperty(this, "cacheDir", {
      value: "tmp/cache",
      writable: false,
      configurable: false,
      enumerable: true
    })
    this.diskTTL = diskTTL
    this.storage = storage.toLowerCase().trim()

    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true })
    }

    if (this.storage === "both" && this.diskTTL > 0) {
      const cleaningInterval = (this.diskTTL * 1000) / 2 + this.diskTTL * 1000 * 0.1

      setInterval(() => {
        this.clearExpiredDiskCache()
      }, cleaningInterval)
    }
  }

  set(key, data) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.cacheDir, key)

      const serializedData = zlib.gzipSync(JSON.stringify(data), {
        level: zlib.constants.Z_BEST_COMPRESSION
      })

      if (this.storage === "both") {
        fs.promises
          .unlink(filePath)
          .catch((error) => {
            if (error.code !== "ENOENT") {
              this.memoryCache.set(key, data, this.memoryTTL)
              reject(error)
            }
          })
          .then(() => {
            return fs.promises.writeFile(filePath, serializedData)
          })
          .then(() => {
            this.memoryCache.set(key, data, this.memoryTTL)
            resolve()
          })
          .catch((error) => {
            this.memoryCache.set(key, data, this.memoryTTL)
            reject(error)
          })
      } else {
        this.memoryCache.set(key, data, this.memoryTTL)
        resolve()
      }
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      const memoryData = this.memoryCache.get(key)
      if (memoryData) {
        return resolve(memoryData)
      }

      if (this.storage === "both") {
        const filePath = path.join(this.cacheDir, key)

        fs.promises
          .readFile(filePath)
          .then((data) => {
            let parsedData
            try {
              parsedData = JSON.parse(zlib.gunzipSync(data).toString())
            } catch (error) {
              parsedData = undefined
              fs.promises.unlink(filePath)
            }

            if (parsedData) {
              this.memoryCache.set(key, parsedData, this.memoryTTL)
            }
            resolve(parsedData)
          })
          .catch((error) => {
            if (error.code === "ENOENT") {
              resolve(undefined)
            } else {
              reject(error)
            }
          })
      } else {
        resolve(undefined)
      }
    })
  }

  del(key) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.cacheDir, key)
      if (this.storage === "both") {
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
      } else {
        this.memoryCache.del(key)
        resolve()
      }
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
      if (err) return

      files.forEach((file) => {
        const filePath = path.join(this.cacheDir, file)

        fs.stat(filePath, (err, stats) => {
          if (err) return

          const fileAgeSeconds = Math.floor((now - stats.mtime.getTime()) / 1000)

          if (fileAgeSeconds > this.diskTTL) {
            fs.unlink(filePath, (err) => {
              if (err) return
            })
          }
        })
      })
    })
  }
}

module.exports = Cache
