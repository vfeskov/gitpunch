import { Collection } from 'mongodb'
import { subject, body } from './email'
import { ActionableUser, Alerted } from './interfaces'
import { SEND_EMAIL_AND_UPDATE_ALERTED, ONLY_UPDATE_ALERTED } from './constants'
import { SES } from 'aws-sdk'
import log from './log'
const { assign, keys } = Object

const region = process.env.SES_REGION
const from = process.env.FROM
const ses = new SES({
  apiVersion: '2010-12-01',
  region
})

export default function sendEmailAndUpdateDb (users: ActionableUser[], collection: Collection) {
  return Promise.all(users.map(async user => {
    try {
      await sendEmail(user)
      await updateDb(user, collection)
    } catch (error) {
      log('alertAndUpdateDbError', { user, error })
    }
  }))
}

export async function sendEmail (user: ActionableUser): Promise<any> {
  const { email, actionableRepos } = user
  const toSend = actionableRepos[SEND_EMAIL_AND_UPDATE_ALERTED]
  if (!toSend.length) { return }

  const params = {
    Source: from,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: {
        Data: subject(toSend)
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body(user, toSend)
        }
      }
    }
  }
  log('alert', { params })
  return new Promise((r, e) =>
    ses.sendEmail(params, (err, data) => err ? e(err) : r(data))
  )
}

export async function updateDb (user: ActionableUser, collection: Collection): Promise<any> {
  const { _id, alerted, actionableRepos, deleteAccessToken } = user
  const update: any = {}
  const repos = [
    ...actionableRepos[SEND_EMAIL_AND_UPDATE_ALERTED],
    ...actionableRepos[ONLY_UPDATE_ALERTED]
  ]
  if (repos.length) {
    const newAlerted = repos.reduce((newAlerted, { repo, tags }) => {
      newAlerted[repo] = tags[0].name
      return newAlerted
    }, {}) as Alerted
    Object.assign(alerted, newAlerted)
    const alertedAsArray = Object.keys(alerted).map(repo => [repo, alerted[repo]])
    update.$set = { alerted: alertedAsArray }
  }
  if (deleteAccessToken) { update.$unset = { accessToken: '' } }
  log('updateDb', { _id, update })
  return collection.updateOne(
    { _id: user._id },
    update
  )
}

