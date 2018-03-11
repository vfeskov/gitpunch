import { MongoClient } from 'mongodb'
import loadUsers from './parts/loadUsers'
import groupByRepo from './parts/groupByRepo'
import fetchTags from './parts/fetchTags'
import backToUsers from './parts/backToUsers'
import findUsersToAlert from './parts/findUsersToAlert'
import fetchReleaseNotes from './parts/fetchReleaseNotes'
import sendEmailAndUpdateDb from './parts/sendEmailAndUpdateDb'
import log from './lib/log'
const url = process.env.MONGODB_URL
const dbName = process.env.MONGODB_DBNAME
const collectionName = process.env.MONGODB_COLLECTIONNAME

export async function handler (event, context, callback) {
  try {
    const client = await MongoClient.connect(url)
    const collection = client.db(dbName).collection(collectionName)
    const dbUsers = await loadUsers(collection)
    const byRepo = groupByRepo(dbUsers)
    const byRepoWithTags = await fetchTags(byRepo)
    const fullUsers = backToUsers(byRepoWithTags)
    const usersToAlert = findUsersToAlert(fullUsers)
    const withReleaseNotes = await fetchReleaseNotes(usersToAlert)
    await sendEmailAndUpdateDb(withReleaseNotes, collection)
    client.close()
    callback()
  } catch (e) {
    log('error', { error: e })
    callback(e)
  }
}
