const zlib = require("zlib")

const NodeCache = require("node-cache")

const fs = require("fs")
const path = require("path")

class DiskCache {
  constructor({ cacheDir = "default", memoryTTL = 0, diskTTL = 0 } = {}) {
    if (cacheDir === "default") {
      cacheDir = path.join("tmp/cache", "/")
    } else {
      if (
        cacheDir.startsWith("./") ||
        cacheDir.startsWith("../") ||
        cacheDir.startsWith("~/") ||
        cacheDir.startsWith("/")
      ) {
        throw new Error(
          "The 'cacheDir' directory must be relative and must not begin with ./, ../, ~/, or /."
        )
      }

      cacheDir = path.join("tmp/cache", cacheDir)
    }

    this.memoryCache = new NodeCache({ stdTTL: memoryTTL })
    this.cacheDir = cacheDir
    this.memoryTTL = memoryTTL
    this.diskTTL = diskTTL

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }

    setInterval(() => {
      console.log("Entrou no clearExpiredDiskCache().")
      this.clearExpiredDiskCache()
    }, 60 * 1000)
  }

  set(key, data) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.cacheDir, key)

      fs.promises
        .readFile(filePath)
        .then((existingData) => {
          const parsedExistingData = zlib.gunzipSync(existingData).toString()

          let currentData = []

          try {
            currentData = JSON.parse(parsedExistingData)
          } catch (error) {
            currentData = []
          }

          const isDuplicate = currentData.some(
            (item) => JSON.stringify(item) === JSON.stringify(data)
          )

          if (!isDuplicate) {
            currentData.push(data)
          } else {
            return resolve()
          }

          const serializedData = zlib.gzipSync(JSON.stringify(currentData), {
            level: zlib.constants.Z_BEST_COMPRESSION
          })
          return fs.promises.writeFile(filePath, serializedData)
        })
        .catch((error) => {
          if (error.code === "ENOENT") {
            const serializedData = zlib.gzipSync(JSON.stringify([data]), {
              level: zlib.constants.Z_BEST_COMPRESSION
            })
            return fs.promises.writeFile(filePath, serializedData)
          }
          throw error
        })
        .then(() => {
          this.memoryCache.set(key, [data], this.memoryTTL)

          resolve()
        })
        .catch((error) => reject(error))
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      const data = this.memoryCache.get(key)

      if (data !== undefined) {
        console.log("Cache em memória!")
        resolve(data)
      } else {
        const filePath = path.join(this.cacheDir, key)
        fs.promises
          .readFile(filePath)
          .then((fileData) => {
            console.log("Cache em disco!")
            const parsedData = zlib.gunzipSync(fileData).toString()
            const jsonData = JSON.parse(parsedData)

            this.memoryCache.set(key, jsonData, this.memoryTTL)

            resolve(jsonData)
          })
          .catch((error) => {
            if (error.code === "ENOENT") {
              console.log("Cache em lado nenhum!")
              resolve(null)
            } else {
              reject(error)
            }
          })
      }
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
          const promises = files.map((file) => {
            const filePath = path.join(this.cacheDir, file)

            this.memoryCache.del(file)
            return fs.promises.unlink(filePath)
          })
          return Promise.all(promises)
        })
        .then(() => resolve())
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

          const fileAgeSeconds = (now - stats.mtime.getTime()) / 1000

          if (fileAgeSeconds > this.diskTTL) {
            fs.unlink(filePath, (err) => {
              if (err) throw err
              console.log(`Arquivo de cache expirado ${filePath} removido.`)
            })
          }
        })
      })
    })
  }
}

module.exports = DiskCache
