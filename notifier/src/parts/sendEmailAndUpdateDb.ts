import { Collection } from 'mongodb'
import Email from './email'
import { ActionableUser, Alerted, RepoWithTags } from './interfaces'
import { SEND_EMAIL_AND_UPDATE_ALERTED, ONLY_UPDATE_ALERTED } from './constants'
import log from 'gitpunch-lib/log'
const { assign, keys } = Object

export default function sendEmailAndUpdateDb (users: ActionableUser[], collection: Collection) {
  return Promise.all(users.map(async user => {
    try {
      await sendEmail(user)
      await updateDb(user, collection)
    } catch (error) {
      log('alertAndUpdateDbError', { user, error: error.message })
    }
  }))
}

export async function sendEmail (user: ActionableUser): Promise<any> {
  const { email, mutedRepos = [], actionableRepos } = user
  const repos = actionableRepos[SEND_EMAIL_AND_UPDATE_ALERTED]
    .filter(({ repo }) => !mutedRepos.includes(repo))
  if (!repos.length) { return }
  return new Email(email, repos).send()
}

export async function updateDb (user: ActionableUser, collection: Collection): Promise<any> {
  const { _id, email, alerted, actionableRepos } = user
  const $set: any = {}
  const repos = [
    ...actionableRepos[SEND_EMAIL_AND_UPDATE_ALERTED],
    ...actionableRepos[ONLY_UPDATE_ALERTED]
  ]
  const newAlerted = repos.reduce((newAlerted, { repo, tags }) => {
    newAlerted[repo] = tags[0].name
    return newAlerted
  }, {}) as Alerted
  Object.assign(alerted, newAlerted)
  const alertedAsArray = Object.keys(alerted).map(repo => [repo, alerted[repo]])
  $set.alerted = alertedAsArray
  log('updateDb', { _id, email, $set })
  return collection.updateOne({ _id }, { $set })
}

