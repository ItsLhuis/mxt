const zlib = require("zlib")

const NodeCache = require("node-cache")

const fs = require("fs")
const path = require("path")

const locks = new Map()

class Cache {
  constructor({ memoryTTL = 0, diskTTL = 0, storage = "both", cacheDir = "data" } = {}) {
    this.memoryCache = new NodeCache({ stdTTL: memoryTTL })
    this.memoryTTL = memoryTTL
    this.diskTTL = diskTTL
    this.storage = storage.toLowerCase().trim()

    const baseDir = "tmp/cache"
    const safeCacheDir = path.normalize(cacheDir).replace(/^(\.\.[\/\\])+/, "")
    this.cacheDir = path.join(baseDir, safeCacheDir)

    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true })
    }

    if ((this.storage === "both" || this.storage === "disk") && this.diskTTL > 0) {
      const cleaningInterval = (this.diskTTL * 1000) / 2 + this.diskTTL * 1000 * 0.1

      setInterval(() => {
        this.clearExpiredDiskCache()
      }, cleaningInterval)
    }
  }

  async set(key, data) {
    await this._acquireLock(key)

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true })
      }

      const filePath = path.join(this.cacheDir, key)

      const serializedData = zlib.gzipSync(JSON.stringify(data), {
        level: zlib.constants.Z_BEST_COMPRESSION
      })

      if (this.storage === "both" || this.storage === "disk") {
        fs.promises
          .unlink(filePath)
          .catch((error) => {
            if (error.code !== "ENOENT") {
              if (this.storage !== "both" && this.storage !== "disk") {
                this.memoryCache.set(key, data, this.memoryTTL)
              }
              reject(error)
            }
          })
          .then(() => {
            return fs.promises.writeFile(filePath, serializedData)
          })
          .then(() => {
            if (this.storage !== "both" && this.storage !== "disk") {
              this.memoryCache.set(key, data, this.memoryTTL)
            }
            resolve()
          })
          .catch((error) => {
            if (this.storage !== "both" && this.storage !== "disk") {
              this.memoryCache.set(key, data, this.memoryTTL)
            }
            reject(error)
          })
          .finally(() => {
            this._releaseLock(key)
          })
      } else {
        this.memoryCache.set(key, data, this.memoryTTL)
        resolve()
        this._releaseLock(key)
      }
    })
  }

  async get(key) {
    await this._acquireLock(key)

    return new Promise((resolve, reject) => {
      if (this.storage !== "disk") {
        const memoryData = this.memoryCache.get(key)
        if (memoryData) {
          this._releaseLock(key)
          return resolve(memoryData)
        }
      }

      if (this.storage === "both" || this.storage === "disk") {
        if (!fs.existsSync(this.cacheDir)) {
          fs.mkdirSync(this.cacheDir, { recursive: true })
        }

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
          .finally(() => {
            this._releaseLock(key)
          })
      } else {
        resolve(undefined)
        this._releaseLock(key)
      }
    })
  }

  async del(key) {
    await this._acquireLock(key)

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true })
      }

      const filePath = path.join(this.cacheDir, key)
      if (this.storage === "both" || this.storage === "disk") {
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
          .finally(() => {
            this._releaseLock(key)
          })
      } else {
        this.memoryCache.del(key)
        resolve()
        this._releaseLock(key)
      }
    })
  }

  async clear() {
    await this._acquireLock("clear")

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true })
      }

      fs.promises
        .readdir(this.cacheDir)
        .then((files) => {
          const promises = files.map((file) => fs.promises.unlink(path.join(this.cacheDir, file)))
          return Promise.all(promises)
        })
        .then(() => {
          if (this.storage === "both" || this.storage !== "disk") {
            this.memoryCache.flushAll()
          }
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          this._releaseLock("clear")
        })
    })
  }

  clearExpiredDiskCache() {
    if (this.diskTTL === 0) {
      return
    }

    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true })
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

  async _acquireLock(key) {
    while (locks.get(key)) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    locks.set(key, true)
  }

  _releaseLock(key) {
    locks.delete(key)
  }
}

module.exports = Cache
