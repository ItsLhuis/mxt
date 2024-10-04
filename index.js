const { addAliases } = require("module-alias")

addAliases({
  "@app": `${__dirname}/app`,
  "@classes": `${__dirname}/classes`,
  "@config": `${__dirname}/config`,
  "@constants": `${__dirname}/constants`,
  "@controllers": `${__dirname}/controllers`,
  "@middlewares": `${__dirname}/middlewares`,
  "@models": `${__dirname}/models`,
  "@routes": `${__dirname}/routes`,
  "@schemas": `${__dirname}/schemas`,
  "@scripts": `${__dirname}/scripts`,
  "@utils": `${__dirname}/utils`,
  "@public": `${__dirname}/public`
})

const fs = require("fs")
const path = require("path")

const { server } = require("./app.js")

const PORT = Number(process.env.PORT) || 8080
const isProduction = process.env.NODE_ENV === "production"
const initialPort = PORT

const clearCache = () => {
  if (fs.existsSync(path.join(__dirname, "tmp")))
    fs.rmSync(path.join(__dirname, "tmp"), { recursive: true, force: true })
}

if (!isProduction) {
  const isPortInUse = (port) => {
    return new Promise((resolve) => {
      const server = require("net").createServer()
      server.once("error", (err) => {
        if (err.code === "EADDRINUSE") {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      server.once("listening", () => {
        server.close()
        resolve(false)
      })
      server.listen(port)
    })
  }

  const startServer = async (port) => {
    while (await isPortInUse(port)) {
      console.warn(`Port ${port} is already in use. Trying next port...`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      port++
    }

    try {
      if (port === initialPort) clearCache()
    } catch (error) {}

    return new Promise((resolve, reject) => {
      server.listen(port)
      server.on("listening", () => {
        resolve(port)
      })
      server.on("error", (error) => {
        server.close()
        reject(error)
      })
    })
  }

  startServer(PORT)
    .then((usedPort) => {
      console.log(`Listening on port ${usedPort} (http://localhost:${usedPort})...`)
    })
    .catch((error) => {
      throw new Error(error)
    })
} else {
  clearCache()

  server.listen(PORT, () => {
    console.log("Server is running...")
  })
}
