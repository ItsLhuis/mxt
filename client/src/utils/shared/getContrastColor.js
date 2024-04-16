export const getContrastColor = (rgbColor) => {
  const rgbValues = rgbColor.substring(4, rgbColor.length - 1).split(",")

  const r = parseInt(rgbValues[0].trim(), 10)
  const g = parseInt(rgbValues[1].trim(), 10)
  const b = parseInt(rgbValues[2].trim(), 10)

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? "rgb(27, 27, 31)" : "rgb(228, 225, 230)"
}
