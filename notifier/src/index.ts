import { MongoClient } from 'mongodb'
import loadUsers from './parts/loadUsers'
import groupByRepo from './parts/groupByRepo'
import filterOutIrrelevantRepos from './parts/filterOutIrrelevantRepos'
import fetchTags from './parts/fetchTags'
import backToUsers from './parts/backToUsers'
import findUsersToAlert from './parts/findUsersToAlert'
import fetchReleaseNotes from './parts/fetchReleaseNotes'
import sendEmailAndUpdateDb from './parts/sendEmailAndUpdateDb'
import log from 'gitpunch-lib/log'
import * as githubAtom from 'gitpunch-lib/githubAtom'
const { MONGODB_URL } = process.env

export async function handler (event, context, callback) {
  let client
  githubAtom.trackTotalRequests()
  try {
    client = await MongoClient.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const collection = client.db().collection('users')
    const dbUsers = await loadUsers(collection)
    const byRepo = groupByRepo(dbUsers)
    const byRepoRelevant = await filterOutIrrelevantRepos(client, byRepo)
    const byRepoWithTags = await fetchTags(byRepoRelevant)
    const fullUsers = backToUsers(byRepoWithTags)
    const usersToAlert = findUsersToAlert(fullUsers)
    const withReleaseNotes = await fetchReleaseNotes(usersToAlert)
    await sendEmailAndUpdateDb(withReleaseNotes, collection)
  } catch (e) {
    log('error', { error: { message: e.message, stack: e.stack } })
  }
  client && client.close()
  githubAtom.closeConnections()
  githubAtom.logTotalRequests()
  callback()
}
