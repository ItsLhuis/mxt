import DOMPurify from "dompurify"

export const formatHTML = (htmlContent) => {
  const cleanHTML = DOMPurify.sanitize(htmlContent, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allowfullscreen", "frameborder"]
  })
  return { __html: cleanHTML }
}
