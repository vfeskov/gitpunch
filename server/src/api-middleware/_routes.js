import { profile } from './profile'
import signIn from './signIn'
import signOut from './signOut'
import * as repos from './repos'
import { watching } from './watching'
import { unsubscribe } from './unsubscribe'
import frequency from './frequency'
import checkAt from './checkAt'
import * as oauth from './oauth'

export const routes = {
     'GET /api/profile'     : profile,
    'POST /api/sign_in'     : signIn,
  'DELETE /api/sign_out'    : signOut,
    'POST /api/repos'       : repos.create,
  'DELETE /api/repos/:repo' : repos.remove,
     'PUT /api/watching'    : watching,
     'PUT /api/frequency'   : frequency,
     'PUT /api/check_at'    : checkAt,
     'PUT /api/unsubscribe' : unsubscribe,
     'GET /api/oauth/start' : oauth.start,
     'GET /api/oauth/done'  : oauth.done
}
