const mjml2html = require("mjml")

function generateEmailHtml(mjmlTemplate, data) {
  const compiledTemplate = mjml2html(mjmlTemplate)
  const html = compiledTemplate.html

  const finalHtml = html.replace(/{{ data\.([^}]+) }}/g, (match, varName) => {
    const value = data[varName.trim()]
    return value !== undefined ? value : ""
  })

  return finalHtml
}

module.exports = generateEmailHtml
