import { MongoClient } from 'mongodb'
import { Agent } from 'https'
import loadUsers from './parts/loadUsers'
import groupByRepo from './parts/groupByRepo'
import getRelevantRepos from './parts/getRelevantRepos'
import fetchTags from './parts/fetchTags'
import backToUsers from './parts/backToUsers'
import findUsersToAlert from './parts/findUsersToAlert'
import fetchReleaseNotes from './parts/fetchReleaseNotes'
import sendEmailAndUpdateDb from './parts/sendEmailAndUpdateDb'
import log from 'gitpunch-lib/log'
import { closeHttpsConnections, trackTotalRequests, totalRequests } from 'gitpunch-lib/githubAtom'
const { MONGODB_URL, MONGODB_DBNAME } = process.env
const MONGODB_COLLECTION_NAME = 'users'

export async function handler (event, context, callback) {
  let client
  trackTotalRequests()
  try {
    const relevantRepos = await getRelevantRepos()
    client = await MongoClient.connect(MONGODB_URL)
    const collection = client.db(MONGODB_DBNAME).collection(MONGODB_COLLECTION_NAME)
    const dbUsers = await loadUsers(collection, relevantRepos)
    const byRepo = groupByRepo(dbUsers)
    const byRepoWithTags = await fetchTags(byRepo)
    const fullUsers = backToUsers(byRepoWithTags)
    const usersToAlert = findUsersToAlert(fullUsers)
    const withReleaseNotes = await fetchReleaseNotes(usersToAlert)
    await sendEmailAndUpdateDb(withReleaseNotes, collection)
  } catch (e) {
    log('error', { error: e })
  }
  client && client.close()
  closeHttpsConnections()
  log('totalRequests', { count: totalRequests() })
  callback()
}
