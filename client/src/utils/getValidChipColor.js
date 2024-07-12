const validColors = ["primary", "secondary", "default", "error", "info", "success", "warning"]

export const getValidChipColor = (color) => {
  return validColors.includes(color) ? color : "default"
}
