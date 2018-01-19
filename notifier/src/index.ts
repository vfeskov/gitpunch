import { MongoClient } from 'mongodb'
import loadUsers from './parts/loadUsers'
import groupByRepo from './parts/groupByRepo'
import fetchTags from './parts/fetchTags'
import backToUsers from './parts/backToUsers'
import findUsersToAlert from './parts/findUsersToAlert'
import combineActionableUsers from './parts/combineActionableUsers'
import sendEmailAndUpdateDb from './parts/sendEmailAndUpdateDb'
import log from './parts/log'
const url = process.env.MONGODB_URL
const dbName = process.env.MONGODB_DBNAME
const collectionName = process.env.MONGODB_COLLECTIONNAME
const { assign } = Object

export async function handler (event, context, callback) {
  try {
    log('start')
    const client = await MongoClient.connect(url)
    const collection = client.db(dbName).collection(collectionName)
    const dbUsers = await loadUsers(collection)
    log('dbUsers', dbUsers)
    const byRepo = groupByRepo(dbUsers)
    const { byRepoWithTags, revokedTokenUsers } = await fetchTags(byRepo)
    const fullUsers = backToUsers(byRepoWithTags)
    const usersToAlert = findUsersToAlert(fullUsers)
    const actionableUsers = combineActionableUsers(usersToAlert, revokedTokenUsers)
    log('actionableUsers', actionableUsers)
    await sendEmailAndUpdateDb(actionableUsers, collection)
    client.close()
    log('finish')
    callback()
  } catch (e) {
    console.error(e)
    log('finish')
    callback(e)
    process.exit(1)
  }
}
