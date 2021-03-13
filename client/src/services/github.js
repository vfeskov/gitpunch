export async function loadStarsFirstPage (accessToken) {
  const reqOpts = makeReqOpts(accessToken)
  const userResp = await fetch('https://api.github.com/user', reqOpts)
  if (userResp.status !== 200) { throw new Error('Failed loading user') }
  const { id } = await userResp.json()
  const starsResp = await fetch(`https://api.github.com/user/${id}/starred`, reqOpts)
  if (starsResp.status !== 200) { throw new Error('Failed loading stars') }
  const links = extractLinks(starsResp.headers.get('Link'))
  const items = await starsResp.json()
  return { items, links }
}

export async function loadStarsLink ({ link, accessToken }) {
  const response = await fetch(link, makeReqOpts(accessToken))
  if (response.status !== 200) { throw new Error() }
  const links = extractLinks(response.headers.get('Link'))
  const items = await response.json()
  return { items, links }
}

export async function loadAllStars (accessToken) {
  let { items, links } = await loadStarsFirstPage(accessToken)
  let { next } = links
  while (next) {
    const response = await loadStarsLink({ link: next, accessToken })
    items = [...items, ...response.items]
    next = response.links.next
  }
  return items.map(item => item.full_name)
}

export async function loadSuggestions ({ value, accessToken }) {
  const response = await fetch(
    'https://api.github.com/search/repositories?q=' + encodeURIComponent(`${value} fork:true`),
    makeReqOpts(accessToken)
  )
  if (response.status !== 200) { throw new Error() }
  return response.json()
}

function makeReqOpts (accessToken) {
  return accessToken ? { headers: { Authorization: `token ${accessToken}` } } : {}
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
