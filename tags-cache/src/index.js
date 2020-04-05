"use strict";

const { MongoClient } = require("mongodb");
const log = require("gitpunch-lib/log").default;
const githubAtom = require("gitpunch-lib");
const getRecentlyReleasedRepos = require("./getRecentlyReleasedRepos").default;
const TagsCache = require("./tagsCache").default;

let {
  MONGODB_URL = "mongodb://localhost:27017/gitpunch",
  GITHUB_FETCH_LIMIT = -1,
} = process.env;
GITHUB_FETCH_LIMIT = +GITHUB_FETCH_LIMIT;

module.exports.handler = async function handler(event, context, callback) {
  let client;
  githubAtom.trackTotalRequests();
  try {
    client = await MongoClient.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // load unique repos of all users that are watching
    const usersCol = client.db().collection("users");
    const userReposCursor = usersCol.aggregate([
      { $match: { watching: true } },
      { $unwind: "$repos" },
      { $group: { _id: "$repos" } },
    ]);

    // load recently released repos from github event queue
    const releasedAll = await getRecentlyReleasedRepos();
    const released = [];

    const tagsCache = new TagsCache(client);
    // mark every existing repo in tagsCache with watched=false
    await tagsCache.resetWatched();
    while (await userReposCursor.hasNext()) {
      const { _id: name } = await userReposCursor.next();
      // track which of the recently released repos are being watched
      releasedAll.includes(name) && released.push(name);
      // insert new repo into tagsCache or update existing with watched=true
      await tagsCache.upsert(name);
    }
    await tagsCache.doneUpserting();
    log("watchedRecentlyReleasedRepos", { released, count: released.length });

    // load repos which tags haven't been loaded for a while
    const outdated = await tagsCache.loadOutdated(
      GITHUB_FETCH_LIMIT - released.length
    );

    // iterate over recently released and outdated repos and update their latest tag in tagsCache
    for (let name of [...released, ...outdated]) {
      const latestTag = await getLatestTag(name);
      await tagsCache.updateLatestTag(name, latestTag);
    }
  } catch (e) {
    log("error", { error: { message: e.message, stack: e.stack } });
  }
  client && client.close();
  githubAtom.closeConnections();
  githubAtom.logTotalRequests();
  callback();
};

function getLatestTag(name) {
  return githubAtom
    .fetchTags(name)
    .then((t) => t[0].name)
    .catch(() => "");
}
