import { DBUser } from './interfaces'
import { Collection } from 'mongodb'

export default async function loadUsers (collection: Collection) {
  const utcHour = new Date().getUTCHours()
  const query = {
    watching: true,
    $or: [
      { frequency: { $exists: false } },
      { frequency: 'hourly' },
      { frequency: 'daily', checkAt: utcHour }
    ]
  }
  const dbUsers = await collection.find(query, {
    projection: { passwordEncrypted: 0 }
  }).toArray()
  return dbUsers.map(user => {
    user.alerted = (user.alerted || [])
      .reduce((alerted, [repo, tag]) => {
        alerted[repo] = tag
        return alerted
      }, {})
    return user
  }) as DBUser[]
}
