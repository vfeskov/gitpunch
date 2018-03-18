export async function loadStarred (accessToken) {
  const reqOpts = makeReqOpts(accessToken)
  const userResp = await fetch('https://api.github.com/user', reqOpts)
  if (userResp.status !== 200) { throw new Error('Failed loading user') }
  const { id } = await userResp.json()
  const starredResp = await fetch(`https://api.github.com/user/${id}/starred`, reqOpts)
  if (starredResp.status !== 200) { throw new Error('Failed loading starred') }
  const links = extractLinks(starredResp.headers.get('Link'))
  const items = await starredResp.json()
  return { items, links }
}

export async function load ({ link, accessToken }) {
  const response = await fetch(link, makeReqOpts(accessToken))
  if (response.status !== 200) { throw new Error() }
  const links = extractLinks(response.headers.get('Link'))
  const items = await response.json()
  return { links, items }
}

export async function loadSuggestions ({ value, accessToken }) {
  const response = await fetch(`https://api.github.com/search/repositories?q=${value}`, makeReqOpts(accessToken))
  if (response.status !== 200) { throw new Error() }
  return response.json()
}

function makeReqOpts (accessToken) {
  return { headers: { Authorization: `token ${accessToken}` } }
}

const parseRegexp = /<([^>]+)>; rel="([^"]+)"/
function extractLinks (linkHeader) {
  try {
    return linkHeader.split(',').reduce((links, part) => {
      const match = part.match(parseRegexp)
      if (match) { links[match[2]] = match[1] }
      return links
    }, {})
  } catch (e) {
    return {}
  }
}
