const zlib = require("zlib")

const fs = require("fs")
const path = require("path")

class DiskCache {
  constructor({ cacheDir = "default", maxSize = null } = {}) {
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

    this.cacheDir = cacheDir
    this.maxSize = maxSize

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }
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
        .then(() => resolve())
        .catch((error) => reject(error))
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.cacheDir, key)
      fs.promises
        .readFile(filePath)
        .then((data) => {
          let parsedData = zlib.gunzipSync(data).toString()
          resolve(JSON.parse(parsedData))
        })
        .catch((error) => {
          if (error.code === "ENOENT") {
            resolve(null)
          } else {
            reject(error)
          }
        })
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      fs.promises
        .readdir(this.cacheDir)
        .then((files) => {
          const data = []

          const promises = files.map((file) => {
            const filePath = path.join(this.cacheDir, file)

            return fs.promises.readFile(filePath).then((fileData) => {
              const parsedData = zlib.gunzipSync(fileData).toString()
              data.push({ key: file, value: JSON.parse(parsedData) })
            })
          })

          Promise.all(promises)
            .then(() => resolve(data))
            .catch((error) => reject(error))
        })
        .catch((error) => reject(error))
    })
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.cacheDir, key)
      fs.promises
        .access(filePath, fs.constants.F_OK)
        .then(() => {
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
        .then(() => resolve())
        .catch((error) => {
          reject(error)
        })
    })
  }

  getTotalKeys() {
    return new Promise((resolve, reject) => {
      fs.promises
        .readdir(this.cacheDir)
        .then((files) => resolve(files.length))
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = DiskCache
