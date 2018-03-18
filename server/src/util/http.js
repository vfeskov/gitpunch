const { assign } = Object

export function success (res, payload, headers = {}) {
  const content = JSON.stringify(payload)
  res.writeHead(200, assign({
    'Content-Type': 'application/json',
    'Content-Length' : Buffer.byteLength(content)
  }, headers))
  res.end(content)
}

export function logErrAndNext500 (err, next) {
  console.error(err)
  next(internalServerError())
}

export function internalServerError (message = null) {
  return makeError(500, message)
}

export function unauthorized () {
  return makeError(401)
}

export function badRequest (message = null) {
  return makeError(400, message)
}

function makeError (code, message) {
  const err = new Error()
  err.statusCode = code
  if (message) {
    err.headers = { 'x-error-message': message }
  }
  return err
}
