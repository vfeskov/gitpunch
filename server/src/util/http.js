const { assign } = Object

export function success (res) {
  return (payload, headers = {}) => {
    const content = JSON.stringify(payload)
    res.writeHead(200, assign({
      'Content-Type': 'application/json',
      'Content-Length' : Buffer.from(content).length
    }, headers))
    res.end(content)
  }
}

export function logAndNextError (next, error) {
  return text => {
    console.error(text)
    next(error)
  }
}

export function internalServerError () {
  return makeError(500)
}

export function unauthorized () {
  return makeError(401)
}

export function badRequest () {
  return makeError(400)
}

function makeError (code) {
  const err = new Error()
  err.statusCode = code
  return err
}
