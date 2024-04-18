const { addAliases } = require("module-alias")

addAliases({
  "@app": `${__dirname}/app.js`,
  "@api": `${__dirname}/api`,
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

const { server } = require("@app")

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  if (PORT == 8080) {
    console.log(`Listening on port ${PORT} (http://localhost:${PORT})...`)
  }
})
