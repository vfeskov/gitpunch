"use strict";

const log = require("gitpunch-lib/log").default;
const { SQS } = require("aws-sdk");

let {
  SQS_URL,
  RECEIVE_MAX_EVENTS = 40,
  SQS_REQUEST_TIMEOUT = 2000,
  DONT_DELETE_EVENTS = false,
} = process.env;
RECEIVE_MAX_EVENTS = +RECEIVE_MAX_EVENTS;
SQS_REQUEST_TIMEOUT = +SQS_REQUEST_TIMEOUT;

const sqs = new SQS({
  apiVersion: "2012-11-05",
});

module.exports.default = async function getRecentlyReleasedRepos() {
  try {
    const messages = await receiveQueuedMesages();
    const repos = [...new Set(messages.map((e) => e.repoName))];
    log("recentlyReleasedRepos", { repos, count: repos.length });
    return repos;
  } catch (e) {
    log("error", { error: e });
    return [];
  }
};

async function receiveQueuedMesages() {
  try {
    const params = {
      QueueUrl: SQS_URL,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 0,
    };
    const responses = await Promise.all(
      Array.from(Array(RECEIVE_MAX_EVENTS / 10)).map(() =>
        receiveMessage(params)
      )
    );
    if (!DONT_DELETE_EVENTS) {
      await Promise.all(responses.map(deleteMessageBatch));
    }
    const messages = responses.reduce((r, i) => r.concat(i.Messages || []), []);
    return messages
      .map((m) => {
        try {
          return JSON.parse(m.Body);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  } catch (e) {
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
