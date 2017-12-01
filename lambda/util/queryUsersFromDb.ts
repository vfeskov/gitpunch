import { RxSimpleDBInstance } from 'rxjs-aws-sdk/RxSimpleDB'

export function queryUsersFromDb(simpleDb: RxSimpleDBInstance, domainName: string) {
  const query = {
    SelectExpression: `select email, repos, alerted from \`${ domainName }\` where repos is not null and watching = '1'`
  }
  return simpleDb.select(query)
}
