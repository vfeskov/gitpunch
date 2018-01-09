import { ALERT_AND_UPDATE_DB, ONLY_UPDATE_DB } from './constants'
import { FullUser, ActionableUser } from './interfaces'

export default function findActionableUsers (users: FullUser[]): ActionableUser[] {
  return users.map(({ _id, email, alerted, repos }) => {
    const actions = repos.reduce((actions, { repo, tags }) => {
      const latestTag = tags[0]
      if (latestTag.name === alerted[repo]) { return actions }
      if (!alerted[repo]) {
        actions[ONLY_UPDATE_DB].push({ repo, tags: [latestTag] })
        return actions
      }
      const alertedIndex = tags.map(t => t.name).indexOf(alerted[repo])
      const toAlert = alertedIndex > -1 ? tags.slice(0, alertedIndex) : [latestTag]
      actions[ALERT_AND_UPDATE_DB].push({ repo, tags: toAlert })
      return actions
    }, { [ALERT_AND_UPDATE_DB]: [], [ONLY_UPDATE_DB]: [] })
    return { _id, email, alerted, actions }
  }).filter(({ actions }) =>
    actions[ALERT_AND_UPDATE_DB].length || actions[ONLY_UPDATE_DB].length
  )
}
