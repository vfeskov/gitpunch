"use strict";

const log = require("gitpunch-lib/log").default;
const { SQS } = require("aws-sdk");

let {
  SQS_URL,
  SQS_REQUEST_TIMEOUT = 2000,
  DONT_DELETE_EVENTS = false,
} = process.env;
SQS_REQUEST_TIMEOUT = +SQS_REQUEST_TIMEOUT;

const sqs = new SQS({
  apiVersion: "2012-11-05",
});

module.exports.default = async function getRecentlyReleasedRepos(limit) {
  try {
    const messages = await receiveQueuedMesages(limit);
    const repos = [...new Set(messages.map((e) => e.repoName))];
    log("recentlyReleasedRepos", { repos, count: repos.length });
    return repos;
  } catch (e) {
    log("error", { error: e });
    return [];
  }
};

async function receiveQueuedMesages(limit) {
  try {
    const params = {
      QueueUrl: SQS_URL,
      MaxNumberOfMessages: 10,
    };
    const responses = [];
    const messages = [];
    while (messages.length < limit) {
      const response = await receiveMessage(params);
      responses.push(response);
      messages.push(
        ...response.Messages.map((m) => {
          try {
            return JSON.parse(m.Body);
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean)
      );
      if (!response.Messages.length) {
        break;
      }
    }
    if (!DONT_DELETE_EVENTS) {
      await Promise.all(responses.map(deleteMessageBatch));
    }
    return messages;
  } catch (e) {
    log('receiveQueuedMesagesError', { error: error.message });
    return [];
  }
}

function receiveMessage(params) {
  const request = sqs.receiveMessage(params);
  setTimeout(() => request.abort(), SQS_REQUEST_TIMEOUT);
  return request.promise().catch((e) => {
    log("receiveMessageError", { error: e });
    return { Messages: [] };
  });
}

function deleteMessageBatch({ Messages }) {
  if (!Messages || !Messages.length) {
    return;
  }
  const request = sqs.deleteMessageBatch({
    QueueUrl: SQS_URL,
    Entries: Messages.map((message, index) => ({
      Id: `${index}`,
      ReceiptHandle: message.ReceiptHandle,
    })),
  });
  setTimeout(() => request.abort(), SQS_REQUEST_TIMEOUT);
  return request
    .promise()
    .catch((e) => log("deleteMessageBatchError", { error: e }));
}
