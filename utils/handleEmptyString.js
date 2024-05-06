const handleEmptyString = (value) => {
  if (typeof value !== "string") {
    return value
  }

  return value.trim() !== "" ? value.trim() : null
}

module.exports = handleEmptyString
