const adjustPaginationParams = (req) => {
  req.query.page =
    (typeof req.query.page === "string" ? Number(req.query.page) : req.query.page) || 1
  req.query.page = req.query.page > 0 ? req.query.page : 1

  req.query.limit =
    (typeof req.query.limit === "string" ? Number(req.query.limit) : req.query.limit) || 10
  req.query.limit = req.query.limit > 0 ? Math.min(req.query.limit, 50) : 10

  req.query.searchTerm = typeof req.query.searchTerm === "string" ? req.query.searchTerm : ""

  try {
    req.query.filterBy = req.query.filterBy ? JSON.parse(req.query.filterBy) : {}
  } catch (error) {
    req.query.filterBy = {}
  }

  req.query.sortOrder = ["ASC", "DESC"].includes(
    req.query.sortOrder ? req.query.sortOrder.toUpperCase() : ""
  )
    ? req.query.sortOrder.toUpperCase()
    : "DESC"
}

module.exports = adjustPaginationParams
