//Count number of files and lines: cloc --exclude-dir=node_modules,tmp,build,dist --exclude-ext=json .

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

if (fs.existsSync(path.join(__dirname, "tmp"))) {
  fs.rmSync(path.join(__dirname, "tmp"), { recursive: true, force: true })
}

const { server } = require("./app.js")

const PORT = process.env.PORT || 8080
const isProduction = process.env.NODE_ENV === "production"

server.listen(PORT, () => {
  if (isProduction) {
    console.log("Server is on...")
  } else {
    console.log(`Listening on port ${PORT} (http://localhost:${PORT})...`)
  }
})
