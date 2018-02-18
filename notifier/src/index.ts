import { MongoClient } from 'mongodb'
import loadUsers from './parts/loadUsers'
import groupByRepo from './parts/groupByRepo'
import fetchTags from './parts/fetchTags'
import backToUsers from './parts/backToUsers'
import findUsersToAlert from './parts/findUsersToAlert'
import sendEmailAndUpdateDb from './parts/sendEmailAndUpdateDb'
import log from './parts/log'
import { start, finish } from './parts/timeTracker'
const url = process.env.MONGODB_URL
const dbName = process.env.MONGODB_DBNAME
const collectionName = process.env.MONGODB_COLLECTIONNAME

export async function handler (event, context, callback) {
  const done = (...args) => {
    finish()
    callback(...args)
  }
  try {
    start()
    const client = await MongoClient.connect(url)
    const collection = client.db(dbName).collection(collectionName)
    const dbUsers = await loadUsers(collection)
    const byRepo = groupByRepo(dbUsers)
    const byRepoWithTags = await fetchTags(byRepo)
    const fullUsers = backToUsers(byRepoWithTags)
    const usersToAlert = findUsersToAlert(fullUsers)
    await sendEmailAndUpdateDb(usersToAlert, collection)
    client.close()
    done()
  } catch (e) {
    log('error', e)
    done(e)
  }
}
