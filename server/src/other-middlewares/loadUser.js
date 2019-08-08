import { verifyToken } from '../util/token'
import { User } from 'gitpunch-lib/db'

export default async function loadUser (req, res, next) {
  if (req.cookies && req.cookies.token) {
    try {
      const { email, id } = await verifyToken(req.cookies.token)
      req.user = await User.load(id ? { id } : { email })
    } catch (e) {}
  }
  next()
}
