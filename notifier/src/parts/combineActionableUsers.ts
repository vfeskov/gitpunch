import { ActionableUser, User } from './interfaces'
import { SEND_EMAIL_AND_UPDATE_ALERTED, ONLY_UPDATE_ALERTED } from './constants'
const { assign, keys } = Object

export default function combineActionableUsers (actionableUsers: ActionableUser[], revokedTokenUsers: User[]) {
  const actionableMap = toEmailMap(actionableUsers)
  const revokedMap = toEmailMap(revokedTokenUsers)
  const uniqueEmails = [...new Set([
    ...keys(revokedMap),
    ...keys(actionableMap)
  ])]
  return uniqueEmails.map(email =>
    normalizeUser(actionableMap[email], revokedMap[email])
  )
}

function toEmailMap (users: User[]) {
  return users.reduce((r, u) => assign(r, {[u.email]: u}), {})
}

function normalizeUser (actionable: ActionableUser, revoked: User) {
  const user = actionable || assign({}, revoked, {
    actionableRepos: {
      [SEND_EMAIL_AND_UPDATE_ALERTED]: [],
      [ONLY_UPDATE_ALERTED]: []
    }
  })
  user.deleteAccessToken = !!revoked
  return user
}
