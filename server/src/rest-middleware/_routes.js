import * as profile from './profile'
import signIn from './signIn'
import signOut from './signOut'
import * as repos from './repos'
import unsubscribe from './unsubscribe'
import * as oauth from './oauth'

export const routes = {
     'GET /api/profile'           : profile.get,
   'PATCH /api/profile'           : profile.patch,
    'POST /api/sign_in'           : [signIn, { skipAuth: true }],
  'DELETE /api/sign_out'          : [signOut, { skipAuth: true }],
    'POST /api/repos'             : repos.create,
    'POST /api/repos/bulk'        : repos.createBulk,
   'PATCH /api/repos/all'         : repos.patchAll,
   'PATCH /api/repos/:repo'       : repos.patch,
  'DELETE /api/repos/all'         : repos.removeAll,
  'DELETE /api/repos/:repo'       : repos.remove,
     'PUT /api/unsubscribe'       : [unsubscribe, { skipAuth: true }],
     'GET /api/oauth/start'       : [oauth.start, { skipAuth: true }],
     'GET /api/oauth/done'        : [oauth.done, { skipAuth: true }]
}
