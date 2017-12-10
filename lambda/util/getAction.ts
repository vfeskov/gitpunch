import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { filter, map, mergeMap, reduce, tap } from 'rxjs/operators'
import { RepoWithUsersDataAndLatestTag, Action } from './interfaces'

const { assign } = Object

export function getAction (repo$: $<RepoWithUsersDataAndLatestTag>): $<Action> {
  return repo$.pipe(
    mergeMap(({ latestTag, repo, usersData }) =>
      of(...usersData.map(_userData => assign(_userData, { repo, latestTag })))
    ),
    map(data => {
      const { repo, latestTag, alerted, email } = data
      let action = ''
      if (!alerted[repo]) {
        action = 'dontAlertButSave'
      } else if (latestTag !== alerted[repo]) {
        action = 'alert'
      }
      return { action, tag: latestTag, repo, alerted, email }
    }),
    filter(({ action }) => !!action),
    tap(event => console.log('getAction', JSON.stringify(event, null, 2)))
  )
}
