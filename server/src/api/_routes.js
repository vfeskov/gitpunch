import { profile } from './profile'
import { login } from './login'
import { register } from './register'
import { logout } from './logout'
import * as repos from './repos'
import { watching } from './watching'
import { unsubscribe } from './unsubscribe'

export const routes = {
     'GET /api/profile'     : profile,
    'POST /api/login'       : login,
    'POST /api/register'    : register,
  'DELETE /api/logout'      : logout,
    'POST /api/repos'       : repos.create,
  'DELETE /api/repos/:repo' : repos.remove,
     'PUT /api/watching'    : watching,
     'PUT /api/unsubscribe' : unsubscribe
}
