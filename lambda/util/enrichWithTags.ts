import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { filter, map, mergeMap, catchError } from 'rxjs/operators'
import { RepoWithUsersData, RepoWithUsersDataAndTags } from './interfaces'
import { RxHR } from "@akanass/rx-http-request"
const accessToken = process.env.GITHUB_ACCESS_TOKEN

export function enrichWithTags (repo$: $<RepoWithUsersData>): $<RepoWithUsersDataAndTags> {
  return repo$.pipe(
    mergeMap(({ repo, usersData }) =>
      RxHR
        .get(`https://api.github.com/repos/${ repo }/tags?access_token=${ accessToken }`, {
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
