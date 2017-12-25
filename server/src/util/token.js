import * as JWT from 'jsonwebtoken'

const LAMBDA_JWT_RSA_PUBLIC_KEY = process.env.WAB_LAMBDA_JWT_RSA_PUBLIC_KEY.replace(/\\n/g, '\n')

export function verifyToken (token, callback) {
  JWT.verify(
    token,
    process.env.WAB_JWT_SECRET,
    callback
  )
}

export function signToken (payload) {
  return JWT.sign(payload, process.env.WAB_JWT_SECRET)
}

export function verifyUnsubscribeToken (token, callback) {
  JWT.verify(
    token,
    LAMBDA_JWT_RSA_PUBLIC_KEY,
    callback
  )
}

export function setCookieTokenHeader (token) {
  return { 'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Lax` }
}

export function unsetCookieTokenHeader () {
  return { 'Set-Cookie': 'token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' }
}
