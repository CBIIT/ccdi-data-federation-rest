/**
 * Repository Common Helpers
 * -------------------------
 * applyFilters(items, filters, allowlist) - shallow equality & array inclusion
 * paginate(items, page, perPage) - slice window
 * groupCounts(items, field) - frequency aggregation with array flattening
 * These remain intentionally minimal; complex querying will live in the real
 * data layer once a persistent store is integrated.
 */
function applyFilters(items, filters, allowlist) {
  if (!filters || Object.keys(filters).length === 0) return items;
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!allowlist.includes(key)) return true; // ignore unsupported filter keys silently
      const itemVal = item[key];
      if (Array.isArray(value)) return value.includes(itemVal);
      return String(itemVal) === String(value);
    });
  });
}

function paginate(items, page, perPage) {
  const offset = (page - 1) * perPage;
  return items.slice(offset, offset + perPage);
}

function groupCounts(items, field) {
  const map = new Map();
  items.forEach(it => {
    const val = it[field];
    if (val === undefined || val === null || val === '') return;
    if (Array.isArray(val)) {
      val.forEach(v => {
        if (v === undefined || v === null || v === '') return;
        map.set(v, (map.get(v) || 0) + 1);
      });
    } else {
      map.set(val, (map.get(val) || 0) + 1);
    }
  });
  return Array.from(map.entries()).map(([value, count]) => ({ value, count }));
}

module.exports = { applyFilters, paginate, groupCounts };
