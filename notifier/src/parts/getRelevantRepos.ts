import { RepoGroup } from './interfaces'
import log from 'gitpunch-lib/log'
import { SQS } from 'aws-sdk'

// how often to fetch all repos, ignoring message queue
const FETCH_ALL_REPOS_INTERVAL = +process.env.FETCH_ALL_REPOS_INTERVAL || 60 // minutes
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL
const RECEIVE_MAX_EVENTS = +process.env.RECEIVE_MAX_EVENTS || 100
const sqs = new SQS({
  apiVersion: '2012-11-05',
  region: process.env.SQS_REGION
})

export default async function getRelevantRepos () {
  try {
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
  await sqs.purgeQueue({
    QueueUrl: SQS_QUEUE_URL
  }).promise()
    .catch(e => log('purgeQueueError', { error: e }))
}

async function receiveQueuedMesages () {
  const params = {
    QueueUrl: SQS_QUEUE_URL,
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 10,
  };
  try {
    const responses = await Promise.all(
      Array.from(Array(RECEIVE_MAX_EVENTS / 10)).map(() =>
        sqs.receiveMessage(params)
          .promise()
          .catch(() => ({ Messages: [] as SQS.Message[] }))
      )
    );
    await Promise.all(responses.map(({ Messages }) => {
      if (!Messages || !Messages.length) {
        return
      }
      return sqs.deleteMessageBatch({
        QueueUrl: SQS_QUEUE_URL,
        Entries: Messages.map((message, index) => ({
          Id: `${index}`,
          ReceiptHandle: message.ReceiptHandle
        }))
      }).promise()
        .catch(e => log('deleteMessageBatchError', { error: e }))
    }))
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
