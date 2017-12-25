import * as Bcrypt from 'bcryptjs'

export function compareHash (string, hash) {
  return new Promise((resolve, error) => {
    Bcrypt.compare(string, hash, (err, success) => {
      if (err) { return error(err) }
      resolve(success)
    })
  })
}

export function hash (data, round) {
  return new Promise((resolve, error) => {
    Bcrypt.hash(data, round, (err, hash) => {
      if (err) { return error(err) }
      resolve(hash)
    })
  })
}
