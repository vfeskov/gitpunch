import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { flattenAttrs } from 'rxjs-aws-sdk/RxSimpleDB'
import { filter, map, mergeMap, catchError } from 'rxjs/operators'
import { SelectResult } from 'aws-sdk/clients/simpledb'
import { UserRaw, User } from './interfaces'

const { assign } = Object
const { isArray } = Array

export function parseUsers (queryResult$: $<SelectResult>) {
  return queryResult$.pipe(
    filter(({ Items }) => Items && !!Items.length),
    mergeMap(({ Items }) => of(...Items)),
    map(({ Name, Attributes }) =>
      assign({ email: Name }, flattenAttrs(Attributes)) as UserRaw
    ),
    map(({ email, repos, alerted }): User => ({
      email,
      repos: repos.split(','),
      alerted: parseForceObject(alerted)
    })),
    catchError(error => {
      console.error('Failed to parse user data', error)
      return of({ error } as User)
    }),
    filter(user => !user.error)
  )
}

function parseForceObject(json) {
  if (!json) { return {} }
  const result = JSON.parse(json)
  return (result !== null && typeof result === 'object' && !isArray(result)) ? result : {}
}
