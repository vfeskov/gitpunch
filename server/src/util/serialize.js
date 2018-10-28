import pick from 'lodash.pick'

export function serialize (user) {
  return pick(user, [
    'id',
    'email',
    'frequency',
    'checkAt',
    'accessToken',
    'watching',
    'watchingStars',
    'alerted',
    'repos'
  ])
}
