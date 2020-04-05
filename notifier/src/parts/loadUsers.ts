import { Collection } from 'mongodb'
import log from 'gitpunch-lib/log'
import { DBUser } from './interfaces'

export default async function loadUsers (collection: Collection) {
  const query: any = {
    watching: true,
    $or: [
      {
        $or: [
          { frequency: { $exists: false } },
          { frequency: 'realtime' }
        ]
      }
    ]
  }

  const date = new Date()
  if (date.getUTCMinutes() === 0) {
    query.$or.push({
      frequency: 'daily',
      checkAt: date.getUTCHours()
    })
  }

  let users: DBUser[] = [];
  const cursor = collection.find(query);
  while(await cursor.hasNext()) {
    const user = await cursor.next();
    user.alerted = (user.alerted || [])
      .reduce((alerted, [repo, tag]) => {
        alerted[repo] = tag
        return alerted
      }, {})
    users.push(user);
  }
  log('dbUsersDetails', { users })
  log('dbUsers', { count: users.length })
  return users
}
