const mjml2html = require("mjml")

const generateEmailHtml = (mjmlTemplate, data) => {
  const compiledTemplate = mjml2html(mjmlTemplate)
  let html = compiledTemplate.html

  html = html.replace(/{{ data\.([^}]+) }}/g, (match, varName) => {
    const value = data[varName.trim()]
    return value !== undefined ? value : ""
  })

  html = html.replace(
    /<blockquote[^>]*>/g,
    '<blockquote style="border-left: 2px solid rgb(197, 196, 205); padding-left: 16px;">'
  )
  html = html.replace(/<\/blockquote>/g, "</blockquote>")

  html = html.replace(/<hr[^>]*>/g, '<hr style="border: 1px solid rgb(197, 196, 205);">')

  return html
}

module.exports = generateEmailHtml
