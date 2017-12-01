import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { filter, map, mergeMap, reduce, catchError, tap } from 'rxjs/operators'
import { Action } from './interfaces'

const { assign, keys } = Object

export function updateDb(simpleDb, domainName) {
  return (action$: $<Action>) => {
    return action$.pipe(
      reduce((usersAlerted, action: Action) => {
        const { repo, email, tag, alerted, error } = action
        if (!error) { return; }
        if (!usersAlerted[email]) {
          usersAlerted[email] = alerted
        }
        usersAlerted[email][repo] = tag
        return usersAlerted
      }, {}),
      mergeMap(usersAlerted =>
        of(...keys(usersAlerted).map(email => ({
          email, alerted: usersAlerted[email]
        })))
      ),
      mergeMap(({ email, alerted }) =>
        simpleDb.putAttributes({
          DomainName: domainName,
          ItemName: email,
          Attributes: [
            { Name: 'alerted', Value: JSON.stringify(alerted), Replace: true }
          ]
        })
        .pipe(
          map(response => assign({ error: null }, response)),
          catchError(error => of({ error })),
          tap(({ error }) => error && console.error('Failed to update db', error, email, alerted)),
        )
      )
    )
  }
}
