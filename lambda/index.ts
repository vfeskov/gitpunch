import { config } from 'dotenv'
config()
import { create as createRxSimpleDB } from 'rxjs-aws-sdk/RxSimpleDB'

import {
  queryUsersFromDb,
  parseUsers,
  groupByRepo,
  enrichWithTags,
  getAction,
  sendEmail,
  updateDb
} from './util'
import { map } from 'rxjs/operators'

const simpleDb = createRxSimpleDB({
  region: process.env.SDB_REGION,
  endpoint: process.env.SDB_ENDPOINT
})
const domainName = process.env.SDB_DOMAIN_NAME

export function handler(event, context, callback) {
  queryUsersFromDb(simpleDb, domainName)
    .pipe(
      parseUsers,
      groupByRepo,
      enrichWithTags,
      getAction,
      sendEmail,
      updateDb(simpleDb, domainName),
      map(() => null)
    )
    .subscribe(callback, callback)
}
