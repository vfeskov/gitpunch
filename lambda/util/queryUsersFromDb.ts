import { RxSimpleDBInstance } from 'rxjs-aws-sdk/RxSimpleDB'
import { tap } from 'rxjs/operators'

export function queryUsersFromDb(simpleDb: RxSimpleDBInstance, domainName: string) {
  const query = {
    SelectExpression: `select email, repos, alerted from \`${ domainName }\` where repos is not null and watching = '1'`
  }
  return simpleDb.select(query).pipe(
    tap(event => console.log('queryUsersFromDb', JSON.stringify(event, null, 2)))
  )
}
