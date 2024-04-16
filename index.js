const { addAliases } = require("module-alias")

addAliases({
  "@api": `${__dirname}/api`,
  "@app": `${__dirname}/app.js`,
  "@config": `${__dirname}/config`,
  "@controllers": `${__dirname}/controllers`,
  "@routes": `${__dirname}/routes`,
  "@utils": `${__dirname}/utils`,
  "@public": `${__dirname}/public`
})

const { server } = require("@app")

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  if (PORT == 8080) {
    console.log(`Listening on port ${PORT} (http://localhost:${PORT})...`)
  }
})
