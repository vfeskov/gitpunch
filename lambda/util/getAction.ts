import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { filter, map, mergeMap, reduce } from 'rxjs/operators'
import { RepoWithUsersDataAndTags, Action } from './interfaces'

const { assign } = Object

export function getAction (repo$: $<RepoWithUsersDataAndTags>): $<Action> {
  return repo$.pipe(
    mergeMap(({ tags, repo, usersData }) =>
      of(...usersData.map(_userData => assign(_userData, { repo, tags })))
    ),
    map(data => {
      const { repo, tags, alerted, email } = data
      const tagNames = tags.map(tag => tag.name)
      let action = ''
      if (!alerted[repo]) {
        action = 'dontAlertButSave'
      } else if (tagNames.indexOf(alerted[repo]) !== 0) {
        action = 'alert'
      }
      return { action, tag: tagNames[0], repo, alerted, email }
    }),
    filter(({ action }) => !!action)
  )
}
