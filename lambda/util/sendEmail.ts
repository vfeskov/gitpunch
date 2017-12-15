import { Observable as $ } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { filter, map, mergeMap, reduce, catchError, tap } from 'rxjs/operators'
import { Action } from './interfaces'
import { create as createSES } from 'rxjs-aws-sdk/RxSES'
import * as JWT from 'jsonwebtoken'

const { assign } = Object
const ses = createSES({
  apiVersion: '2010-12-01',
  region: process.env.SES_REGION
})
const JWT_RSA_PRIVATE_KEY = process.env.JWT_RSA_PRIVATE_KEY.replace(/\\n/g, '\n')
const { APP_URL } = process.env

export function sendEmail (action$: $<Action>) {
  return action$.pipe(
    mergeMap(action => {
      const { email, tag, repo } = action
      if (action.action !== 'alert') { return of(action) }
      return sendEmailRequest({
        email: email,
        subject: `New GitHub Release: ${ repo } ${ tag }`,
        body: `Greetings! :)<br/><br/>` +
          `They released a new version of ${ repo }, check it out:<br/>` +
          `https://github.com/${ repo }/releases/tag/${ tag }<br/><br/>` +
          `Have a great day,<br/>` +
          `Vladimir from <a href="https://beer.vfeskov.com">Win A Beer</a><br/>` +
          `---<br/>` +
          `<a href="https://github.com/vfeskov/win-a-beer-react">Star me on GitHub</a><br/>` +
          `To stop getting these emails click <a href="${ getUnsubscribeUrl(email) }">unsubscribe</a><br/><br/>`
      }).pipe(
        map(({ error }) => assign({ error }, action)),
      )
    })
  )
}

function getUnsubscribeUrl (email: string) {
  const token = JWT.sign(
    { email },
    JWT_RSA_PRIVATE_KEY,
    { algorithm: 'RS256' }
  )
  return `${ APP_URL }/unsubscribe/${ token }`
}

function sendEmailRequest ({ email, subject, body }) {
  const params = {
    Source: process.env.FROM,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: {
        Data: subject
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      }
    }
  }
  const stringifiedParams = JSON.stringify(params, null, 2)
  return ses.sendEmail(params)
    .pipe(
      map(response => assign({ error: null }, response)),
      catchError(error => of({ error })),
      tap(({ error }) => error ?
        console.error('sendEmail', 'ERROR', error, stringifiedParams) :
        console.log('sendEmail', 'SUCCESS', stringifiedParams)
      )
    )
}
