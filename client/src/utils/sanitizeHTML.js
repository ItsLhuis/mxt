export const sanitizeHTML = (htmlString) => {
  return htmlString ? htmlString.replace(/<\/?[^>]+(>|$)/g, "") : ""
}
