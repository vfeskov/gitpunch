import { MongoClient } from "mongodb";
import loadUsers from "./parts/loadUsers";
import groupByRepo from "./parts/groupByRepo";
import filterOutIrrelevantRepos from "./parts/filterOutIrrelevantRepos";
import fetchTags from "./parts/fetchTags";
import backToUsers from "./parts/backToUsers";
import findUsersToAlert from "./parts/findUsersToAlert";
import fetchReleaseNotes from "./parts/fetchReleaseNotes";
import sendEmailAndUpdateDb from "./parts/sendEmailAndUpdateDb";
import log, { debug } from "gitpunch-lib/log";
import * as githubAtom from "gitpunch-lib/githubAtom";
const { MONGODB_URL } = process.env;

export async function handler(event, context, callback) {
  let client: MongoClient;
  githubAtom.trackTotalRequests();
  try {
    client = await MongoClient.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const collection = client.db().collection("users");
    debug("loadUsers");
    const dbUsers = await loadUsers(collection);
    debug("groupByRepo");
    const byRepo = groupByRepo(dbUsers);
    debug("filterOutIrrelevantRepos");
    const byRepoRelevant = await filterOutIrrelevantRepos(client, byRepo);
    debug("fetchTags");
    const byRepoWithTags = await fetchTags(client, byRepoRelevant);
    debug("backToUsers");
    const fullUsers = backToUsers(byRepoWithTags);
    debug("findUsersToAlert");
    const usersToAlert = findUsersToAlert(fullUsers);
    debug("fetchReleaseNotes");
    const withReleaseNotes = await fetchReleaseNotes(usersToAlert);
    debug("sendEmailAndUpdateDb");
    await sendEmailAndUpdateDb(withReleaseNotes, collection);
  } catch (e) {
    log("error", { error: { message: e.message, stack: e.stack } });
  }
  client && client.close();
  githubAtom.closeConnections();
  githubAtom.logTotalRequests();
  callback();
}
