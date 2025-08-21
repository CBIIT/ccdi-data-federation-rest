/**
 * Pagination Utility
 * ------------------
 * buildLinkHeader(req, page, perPage, total)
 * Generates an RFC5988 Web Linking header value including required first/last
 * relations and conditional prev/next. Existing non-pagination query params
 * are preserved so clients can follow links without re-specifying filters.
 */
function buildLinkHeader(req, page, perPage, total) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const rels = [];
  const buildUrl = (p) => {
    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`);
    // Preserve existing query params except page/per_page
    Object.entries(req.query || {}).forEach(([k,v]) => {
      if (k === 'page' || k === 'per_page') return;
      if (Array.isArray(v)) v.forEach(val => url.searchParams.append(k, val));
      else url.searchParams.set(k, v);
    });
    url.searchParams.set('page', p);
    url.searchParams.set('per_page', perPage);
    return url.toString();
  };
  // first & last always
  rels.push(`<${buildUrl(1)}>; rel="first"`);
  rels.push(`<${buildUrl(totalPages)}>; rel="last"`);
  if (page > 1) rels.push(`<${buildUrl(page - 1)}>; rel="prev"`);
  if (page < totalPages) rels.push(`<${buildUrl(page + 1)}>; rel="next"`);
  return rels.join(', ');
}

module.exports = { buildLinkHeader };
