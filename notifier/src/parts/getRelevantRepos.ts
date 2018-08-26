import { RepoGroup } from './interfaces'
import log from 'gitpunch-lib/log'
import { SQS, Request, AWSError } from 'aws-sdk'

// how often to fetch all repos, ignoring message queue
const FETCH_ALL_REPOS_INTERVAL = +process.env.FETCH_ALL_REPOS_INTERVAL || 60 // minutes
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL
const RECEIVE_MAX_EVENTS = +process.env.RECEIVE_MAX_EVENTS || 40
const SQS_REQUEST_TIMEOUT = +process.env.SQS_REQUEST_TIMEOUT || 2000
const DONT_USE_QUEUE = process.env.DONT_USE_QUEUE;
const sqs = new SQS({
  apiVersion: '2012-11-05',
  region: process.env.SQS_REGION
})

export default async function getRelevantRepos () {
  try {
    if (DONT_USE_QUEUE) {
      return null
    }
    const now = new Date()
    const minutes = now.getUTCHours() * 60 + now.getUTCMinutes()
    // if it's time to fetch all repos
    if (minutes % FETCH_ALL_REPOS_INTERVAL === 0) {
      await purgeMessageQueue()
      return null // means all are relevant
    }
    // otherwise fetch only those for which there are messages in the queue
    const messages = await receiveQueuedMesages()
    const repos = messages
      .map(e => e.repoName)
      .filter((r, i, self) => self.indexOf(r) === i)
    log('relevantRepos', { repos, count: repos.length })
    return repos
  } catch (e) {
    log('error', { error: e })
    return []
  }
}

async function purgeMessageQueue () {
  const request = sqs.purgeQueue({
    QueueUrl: SQS_QUEUE_URL
  })
  setTimeout(() => request.abort(), SQS_REQUEST_TIMEOUT)
  return request.promise().catch(e => log('purgeQueueError', { error: e }))
}

async function receiveQueuedMesages () {
  try {
    const params = {
      QueueUrl: SQS_QUEUE_URL,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 10,
    };
    const responses = await Promise.all(
      Array.from(Array(RECEIVE_MAX_EVENTS / 10)).map(() => receiveMessage(params))
    );
    await Promise.all(responses.map(deleteMessageBatch))
    const messages = responses.reduce((r, i) => r.concat(i.Messages || []), []);
    return messages.map(m => {
      try {
        return JSON.parse(m.Body)
      } catch (e) {
        return null
      }
    }).filter(Boolean)
  } catch (e) {
    return []
  }
}

function receiveMessage (params) {
  const request = sqs.receiveMessage(params)
  setTimeout(() => request.abort(), SQS_REQUEST_TIMEOUT)
  return request.promise().catch(e => {
    log('receiveMessageError', { error: e })
    return { Messages: [] as SQS.Message[] }
  })
}

function deleteMessageBatch ({ Messages }) {
  if (!Messages || !Messages.length) {
    return
  }
  const request = sqs.deleteMessageBatch({
    QueueUrl: SQS_QUEUE_URL,
    Entries: Messages.map((message, index) => ({
      Id: `${index}`,
      ReceiptHandle: message.ReceiptHandle
    }))
  })
  setTimeout(() => request.abort(), SQS_REQUEST_TIMEOUT)
  return request.promise().catch(e => log('deleteMessageBatchError', { error: e }))
}
