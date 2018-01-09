import { MongoClient } from 'mongodb'
import loadUsers from './parts/loadUsers'
import groupByRepo from './parts/groupByRepo'
import fetchTags from './parts/fetchTags'
import backToUsers from './parts/backToUsers'
import { DBUser } from './parts/interfaces'
import findActionableUsers from './parts/findActionableUsers';
import alertAndUpdateDb from './parts/alertAndUpdateDb'
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
    const byRepoWithTags = await fetchTags(byRepo)
    const fullUsers = backToUsers(byRepoWithTags)
    const actionableUsers = findActionableUsers(fullUsers)
    log('actionableUsers', actionableUsers)
    await alertAndUpdateDb(actionableUsers, collection)
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
