import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { reduce, mergeMap, tap } from 'rxjs/operators'
import { RepoWithUsersData, User } from './interfaces'

const { keys } = Object

export function groupByRepo (users$: $<User>): $<RepoWithUsersData> {
  return users$.pipe(
    reduce((result, user: User) => {
      const { repos, alerted, email } = user
      repos
        .filter(repo => /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))
        .forEach(repo => {
          result[repo] = (result[repo] || []).concat({ email, alerted })
        })
      return result
    }, {}),
    mergeMap(usersGroupedByRepo =>
      of(...keys(usersGroupedByRepo).map(repo => ({
        repo,
        usersData: usersGroupedByRepo[repo]
      })))
    ),
    tap(event => console.log('groupByRepo', JSON.stringify(event, null, 2)))
  )
}
