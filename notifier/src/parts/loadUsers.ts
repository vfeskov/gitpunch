import { Collection } from 'mongodb'
import log from 'gitpunch-lib/log'
import { DBUser } from './interfaces'

export default async function loadUsers (collection: Collection, relevantRepos: String[]) {
  const query: any = {
    watching: true,
    $or: [
      { frequency: { $exists: false } },
      { frequency: 'realtime' }
    ]
  }

  const date = new Date()
  if (date.getUTCMinutes() === 0) {
    query.$or.push({
      frequency: 'daily',
      checkAt: date.getUTCHours()
    })
  }

  if (relevantRepos) {
    query.repos = {
      '$in': relevantRepos
    }
  }

  const dbUsers = await collection.find(query).toArray()
  if (!dbUsers.length) {
    return []
  }
  const users = dbUsers.map(user => {
    user.alerted = (user.alerted || [])
      .reduce((alerted, [repo, tag]) => {
        alerted[repo] = tag
        return alerted
      }, {})
    return user
  }) as DBUser[]
  log('dbUsers', { count: users.length })
  log('dbUsersDetails', { users })
  return users
}
