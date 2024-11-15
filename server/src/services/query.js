const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_LIMIT = 100; // 0;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE;
  // const page = Math.max(1, query.page);
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  // const limit = Math.max(1, query.limit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = {
  getPagination
}