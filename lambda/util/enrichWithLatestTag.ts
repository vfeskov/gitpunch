import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { filter, map, mergeMap, catchError, tap } from 'rxjs/operators'
import { RepoWithUsersData, RepoWithUsersDataAndLatestTag } from './interfaces'
import { RxHR } from "@akanass/rx-http-request"
const accessToken = process.env.GITHUB_ACCESS_TOKEN

export function enrichWithLatestTag (repo$: $<RepoWithUsersData>): $<RepoWithUsersDataAndLatestTag> {
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
            const tags = JSON.parse(body)
            return ({
              latestTag: tags.length ? tags[0].name : null,
              repo,
              usersData
            })
          }),
          catchError(error => {
            console.error(`Failed to load tags for ${ repo }`, error)
            return of({ error })
          })
        ) as $<RepoWithUsersDataAndLatestTag>
    ),
    filter(({ error, latestTag }) => !error && !!latestTag),
    tap(event => console.log('enrichWithLatestTag', JSON.stringify(event, null, 2)))
  )
}
