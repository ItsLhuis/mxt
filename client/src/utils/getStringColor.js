export const getStringColor = (string) => {
  let hash = 0
  let i

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  const rgb = []

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    rgb.push(value)
  }

  return `rgb(${rgb.join(", ")})`
}
