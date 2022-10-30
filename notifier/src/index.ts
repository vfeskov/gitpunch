import loadUsers from "./parts/loadUsers.js";
import groupByRepo from "./parts/groupByRepo.js";
import filterOutIrrelevantRepos from "./parts/filterOutIrrelevantRepos.js";
import fetchTags from "./parts/fetchTags.js";
import backToUsers from "./parts/backToUsers.js";
import findUsersToAlert from "./parts/findUsersToAlert.js";
import fetchReleaseNotes from "./parts/fetchReleaseNotes.js";
import sendEmailAndUpdateDb from "./parts/sendEmailAndUpdateDb.js";
import log, { debug } from "gitpunch-lib/log.js";
import * as githubAtom from "gitpunch-lib/githubAtom.js";
import { connect, disconnect } from "gitpunch-lib/db/index.js";

export async function handler(event, context, callback) {
  githubAtom.trackTotalRequests();
  try {
    await connect();
    debug("loadUsers");
    const dbUsers = await loadUsers();
    debug("groupByRepo");
    const byRepo = groupByRepo(dbUsers);
    debug("filterOutIrrelevantRepos");
    const byRepoRelevant = await filterOutIrrelevantRepos(byRepo);
    debug("fetchTags");
    const byRepoWithTags = await fetchTags(byRepoRelevant);
    debug("backToUsers");
    const fullUsers = backToUsers(byRepoWithTags);
    debug("findUsersToAlert");
    const usersToAlert = findUsersToAlert(fullUsers);
    debug("fetchReleaseNotes");
    const withReleaseNotes = await fetchReleaseNotes(usersToAlert);
    debug("sendEmailAndUpdateDb");
    await sendEmailAndUpdateDb(withReleaseNotes);
  } catch (e) {
    log("error", { error: { message: e.message, stack: e.stack } });
  }
  await disconnect();
  githubAtom.closeConnections();
  githubAtom.logTotalRequests();
  callback();
}
