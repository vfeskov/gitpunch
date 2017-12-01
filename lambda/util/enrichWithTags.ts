import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { filter, map, mergeMap, catchError } from 'rxjs/operators'
import { RepoWithUsersData, RepoWithUsersDataAndTags } from './interfaces'
import { RxHR } from "@akanass/rx-http-request"

export function enrichWithTags (repo$: $<RepoWithUsersData>): $<RepoWithUsersDataAndTags> {
  return repo$.pipe(
    mergeMap(({ repo, usersData }) =>
      RxHR
        .get(`https://api111.github.com/repos/${ repo }/tags`, {
          headers: {
            'User-Agent': process.env.GITHUB_API_USER_AGENT
          }
        })
        .pipe(
          map(({ response, body }) => {
            if (response.statusCode !== 200) {
              throw new Error(`status code ${ response.statusCode }`)
            }
            return ({
              tags: JSON.parse(body),
              repo,
              usersData
            })
          }),
          catchError(error => {
            console.error(`Failed to load tags for ${ repo }`, error)
            return of({ error })
          })
        ) as $<RepoWithUsersDataAndTags>
    ),
    filter(({ error, tags }) => !error && !!(tags && tags.length))
  )
}
