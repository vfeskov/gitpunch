let customSource = null
let parsed = null

export function setSource (source = '') {
  customSource = source
  parsed = null
}

export function get (name) {
  parsed = parsed || parse()
  return parsed[name]
}

export function set (name, value) {
  document.cookie = `${name}=${value}; expires=Thu, 01 Jan 2030 00:00:00 GMT; Path=/; SameSite=Lax`
}

function parse () {
  const source = customSource === null ?
    document.cookie :
    customSource
  return source.split(';').reduce((r, i) => {
    const [k, v] = i.trim().split('=')
    return { [k]: v, ...r }
  }, {})
}
