import { Collection } from 'mongodb'
import log from './log'
import { DBUser } from './interfaces'

export default async function loadUsers (collection: Collection) {
  const query = {
    watching: true,
    $or: [
      { frequency: { $exists: false } },
      { frequency: 'realtime' }
    ] as any
  }

  const date = new Date()
  if (date.getUTCMinutes() === 0) {
    query.$or.push({
      frequency: 'daily',
      checkAt: date.getUTCHours()
    })
  }

  const dbUsers = await collection.find(query, {
    projection: { passwordEncrypted: 0 }
  }).toArray()
  const users = dbUsers.map(user => {
    user.alerted = (user.alerted || [])
      .reduce((alerted, [repo, tag]) => {
        alerted[repo] = tag
        return alerted
      }, {})
    return user
  }) as DBUser[]
  log('dbUsers', users)
  return users
}
