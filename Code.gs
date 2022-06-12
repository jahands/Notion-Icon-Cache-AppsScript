// git: https://github.dev/jahands/Notion-Icon-Cache-AppsScript

// Scripts sharing this code:
// https://script.google.com/home/projects/18KGVC-6U2h5oPmLVK55xZ9J8wQVeq3iJDEF0rvnMPkqVcZaRor82Mxl0/edit
// https://script.google.com/home/projects/1MpHu0xX7A78zZsEihGwo-t59LVq5d7e2ARwEQmkhsulD060tgIuw4y2Z/edit

// Re-encodes URI that may only be partially encoded
function reEncodeURI(input) {
  return encodeURIComponent(decodeURI(input))
}

function _formatCacheLink(readCacheURL, name, upstreamURL, pathPrefix) {
  let url = readCacheURL
    .replace('{{:NAME}}', encodeURIComponent(name.replaceAll(' ', '_')))
    .replace('{{:URL}}', reEncodeURI(upstreamURL))
  if (pathPrefix && pathPrefix.length > 0) {
    url = url.replace('/{{:PATH_PREFIX}}/', `/${pathPrefix}/`)
  } else {
    // Make sure we don't end up with double slashes
    url = url.replace('/{{:PATH_PREFIX}}/', '/')
  }
  return url
}
const imageExtensions = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.bmp',
  '.gif',
  '.tiff'
]
// Can take array or string, not just array
// _pathPrefixes is optional
function FormatCacheLinkArray(readCacheURL, _names, _upstreamURLs, _pathPrefixes) {
  // Input could be a string or an array of arrays for rows/columns
  // so we want to standardize input here
  let names = Array.isArray(_names) ? _names : [[_names]]
  let upstreamURLs = Array.isArray(_upstreamURLs) ? _upstreamURLs : [[_upstreamURLs]]
  let pathPrefixes = Array.isArray(_pathPrefixes) ? _pathPrefixes : [[_pathPrefixes]]
  if (!Array.isArray(names) || !Array.isArray(upstreamURLs)) {
    throw new Error('must provide values for _names and _upstreamURLs')
  }
  if (names.length !== upstreamURLs.length) {
    throw new Error('must provide same number of names and upstream URLs, and pathPrefixes')
  }
  let cacheLinks = []
  for (let i = 0; i < names.length; i++) {
    if (!names[i][0] || !upstreamURLs[i][0]) {
      break // End of data
    }

    let name = names[i][0]
    const upstreamURL = upstreamURLs[i][0]
    // Default pathPrefix to nothing
    const pathPrefix = pathPrefixes.length > i ? pathPrefixes[i][0] : ''

    // Only try to add an extension if there isn't one already
    if (!imageExtensions.some(e => name.toLowerCase().endsWith(e))) {
      const extensions = imageExtensions
        // Find all extensions found in the string
        .filter(e => upstreamURL.includes(e))
        // We want to use the first found extension, so sort by order found in the string
        .sort((a, b) => s.indexOf(a) - s.indexOf(b))

      if (extensions.length > 0) {
        name += extensions[0]
      }
    }
    cacheLinks.push(_formatCacheLink(
      readCacheURL,
      name,
      upstreamURL,
      pathPrefix
    ))
  }
  return cacheLinks
}

// Trims surrounding chars
function TrimChars(charToRemove, str) {
  while (str.startsWith(charToRemove)) {
    str = str.slice(1)
  }
  while (str.endsWith(charToRemove)) {
    str = str.slice(0, -1)
  }
  return str
}

// NOT USING THIS
function GetCategoryImages(data, categories, offset) {
  // data is a 2D array of rows/columns

  const columns = {
    Notion: { name: "Notion", index: 0 },
    Category: { name: "Category", index: 1 },
    Star_System: { name: "Star System", index: 2 },
    Name: { name: "Name", index: 3 },
    Preview: { name: "Preview", index: 4 },
    Link: { name: "Link", index: 5 },
    Read_Link: { name: "Read Link", index: 7 }
  }
  const output = []
  for (const cat of categories
    // ["msc"] => "msc"
    .map(c => c[0])
  ) {
    if (cat === '') {
      continue // Skip empty categories
    }

    const dataForCat = data.filter(d => d[columns.Category.index] === cat)
    if (dataForCat && dataForCat.length > offset) {
      const next = dataForCat[offset]
      output.push(
        [next[columns.Name.index]],
        [next[columns.Read_Link.index]]
      )
    } else {
      output.push([], [])
    }
  }
  return output
}

// NOT USING THIS
// Helper function to add empty lines after each item. 1D array only
function AddSpacing(inputArray, emptyPerRow) {
  const output = []
  for (const row of inputArray) {
    output.push(row)
    for (let i = 0; i < emptyPerRow; i++) {
      output.push([])
    }
  }
  return output
}
