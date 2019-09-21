import fetch from 'node-fetch'
import { randomBytes } from 'crypto'
import { User } from 'gitpunch-lib/db'
import { signToken, setCookieTokenHeader } from '../util/token'
import { withTags } from '../util/githubAtom'
import { validRepos } from '../util/validations'
const clientId = process.env.WAB_OAUTH_CLIENT_ID
const clientSecret = process.env.WAB_OAUTH_CLIENT_SECRET
const clientHost = process.env.WAB_CLIENT_HOST

export function start (req, res, next) {
  const state = randomBytes(32).toString('hex')
  const flags = 'Path=/; expires=0; HttpOnly; SameSite=Lax'
  const cookies = [`githubOAuthState=${state}; ${flags}`]
  const { repos, returnTo } = req.params || {}
  if (repos) { cookies.push([`repos=${hex(repos)}; ${flags}`]) }
  if (returnTo) { cookies.push([`returnTo=${hex(returnTo)}; ${flags}`]) }
  res.writeHead(302, {
    'Set-Cookie': cookies,
    'Location': `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&state=${state}`
  })
  res.end()
}

export async function done (req, res, next) {
  const { code, state } = req.params
  const { githubOAuthState: rightState, repos, returnTo } = req.cookies
  const flags = 'Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  const cookies = [
    `githubOAuthState=; ${flags}`,
    `repos=; ${flags}`,
    `returnTo=; ${flags}`
  ]
  let redirect = clientHost
  if (state === rightState && code) {
    const token = await authToken(code, state, repos)
    cookies.push(setCookieTokenHeader(token))
    redirect += parseReturnTo(returnTo)
  }
  res.writeHead(302, {
    'Set-Cookie': cookies,
    Location: redirect
  })
  res.end()
}

async function authToken (code, state, repos) {
  try {
    const accessToken = await getAccessToken(code, state)
    const githubId = await getGithubId(accessToken)
    let user = await User.load({ githubId })
    if (user) {
      await user.update({ accessToken })
    } else {
      repos = parseRepos(repos)
      repos = await withTags(repos)
      const email = await getEmail(accessToken)
      user = await User.create({ email, accessToken, githubId, repos })
    }
    return signToken({ id: user.id })
  } catch (error) {
    console.error('authTokenError', code, error)
  }
}

async function getAccessToken (code, state) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      state
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
  if (response.status !== 200) { throw Error(`accessToken status ${response.status}`) }
  const json = await response.json()
  const accessToken = json.access_token
  if (!accessToken) { throw Error(`Empty accessToken ${JSON.stringify(json)}`)}
  return accessToken
}

async function getGithubId (accessToken) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: 'application/json'
    }
  })
  if (response.status !== 200) { throw Error(`getGithubId ${response.status} ${accessToken}`) }
  const { id: githubId } = await response.json()
  return githubId
}

async function getEmail (accessToken) {
  const response = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: 'application/json'
    }
  })
  if (response.status !== 200) { throw Error(`getEmail ${response.status} ${accessToken}`) }
  const emails = await response.json()
  const primary = emails.find(e => e.primary)
  if (!primary || !primary.email) {
    throw Error(`No primary email ${JSON.stringify(emails)} ${accessToken}`)
  }
  return primary.email
}

function parseRepos (repos) {
  if (!repos) { return [] }
  try {
    repos = fromHex(repos)
    repos = decodeURIComponent(repos)
    repos = JSON.parse(repos)
    return validRepos(repos) ? repos : []
  } catch (e) {
    return []
  }
}

function parseReturnTo (returnTo) {
  if (!returnTo) { return '' }
  try {
    returnTo = fromHex(returnTo)
    return /^\/[a-z0-9\-]+$/.test(returnTo) ? returnTo : ''
  } catch (e) {
    return ''
  }
}

function hex (string) {
  return Buffer.from(string).toString('hex')
}

function fromHex (string) {
  return Buffer.from(string, 'hex').toString()
}
