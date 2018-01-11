import { randomBytes } from 'crypto'
import fetch from 'node-fetch'
import { load, create, update } from '../db'
import { signToken, setCookieTokenHeader } from '../util/token'
import { validRepos } from '../util/validations'
const clientId = process.env.WAB_OAUTH_CLIENT_ID
const clientSecret = process.env.WAB_OAUTH_CLIENT_SECRET
const clientHost = process.env.WAB_CLIENT_HOST

export function start (req, res, next) {
  const state = randomBytes(32).toString('hex')
  const flags = 'Path=/; expires=0; HttpOnly; SameSite=Lax'
  const cookies = [`githubOAuthState=${state}; ${flags}`]
  const { repos } = req.params || {}
  if (repos) {
    const reposHex = new Buffer(repos).toString('hex')
    cookies.push([`repos=${reposHex}; ${flags}`])
  }
  res.writeHead(302, {
    'Set-Cookie': cookies,
    'Location': `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&state=${state}`
  })
  res.end()
}

export async function done (req, res, next) {
  const { code, state } = req.params
  const { githubOAuthState: rightState, repos } = req.cookies
  const flags = 'Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  const cookies = [
    `githubOAuthState=; ${flags}`,
    `repos=; ${flags}`
  ]
  if (state === rightState && code) {
    const token = await authToken(code, state, repos)
    cookies.push(setCookieTokenHeader(token))
  }
  res.writeHead(302, {
    'Set-Cookie': cookies,
    Location: clientHost
  })
  res.end()
}

async function authToken (code, state, repos) {
  try {
    const accessToken = await getAccessToken(code, state)
    const email = await getEmail(accessToken)
    let user = await load({ email })
    if (user) {
      await update({ id: user.id }, { accessToken })
    } else {
      repos = parseRepos(repos)
      user = await create({ email, accessToken, repos })
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

async function getEmail (accessToken) {
  const response = await fetch('https://api.github.com/user/public_emails', {
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
    repos = Buffer.from(repos, 'hex').toString()
    repos = decodeURIComponent(repos)
    repos = JSON.parse(repos)
    return validRepos(repos) ? repos : []
  } catch (e) {
    return []
  }
}
