"use strict";

import moment from "moment";
import log from "gitpunch-lib/log.js";
let {
  HOURS_AGO_IS_OUTDATED_WITH_TAGS = 24,
  HOURS_AGO_IS_OUTDATED_WITHOUT_TAGS = 72,
  CACHE_REPOS_EXPIRY_HOURS = 1,
} = process.env;

let cacheRepos;
let cacheReposLoadedAt = moment();

export default class TagsCache {
  constructor(client) {
    this.collection = client.db().collection("tagsCache");
    this.toUpdateWatched = [];
    this.toUpdateNotWatched = [];
    this.toInsert = [];
  }

  async loadAll() {
    if (
      !cacheRepos ||
      moment().diff(cacheReposLoadedAt, "hours") > +CACHE_REPOS_EXPIRY_HOURS
    ) {
      const then = moment();
      cacheRepos = {};
      const cursor = this.collection.find({}, { name: 1, watched: 1 });
      while (await cursor.hasNext()) {
        const repo = await cursor.next();
        cacheRepos[repo.name] = repo.watched;
      }
      cacheReposLoadedAt = moment();
      log("tagsCacheLoadAll", { duration: moment().diff(then, "ms") });
    } else {
      log("tagsCacheReused");
    }
    return cacheRepos;
  }

  addWatchedRepo(name) {
    if (!cacheRepos.hasOwnProperty(name)) {
      this.toInsert.push(name);
      return;
    } else if (!cacheRepos[name]) {
      this.toUpdateWatched.push(name);
    }
    cacheRepos[name] = null;
  }

  updateWatched() {
    const { toUpdateWatched, toUpdateNotWatched, toInsert } = this;

    for (let name in cacheRepos) {
      if (cacheRepos[name]) {
        toUpdateNotWatched.push(name);
      } else if (cacheRepos[name] === null) {
        cacheRepos[name] = !toUpdateWatched.includes(name);
      }
    }
    if (
      !toUpdateWatched.length &&
      !toUpdateNotWatched.length &&
      !toInsert.length
    ) {
      return;
    }
    const queries = [];
    // update watched = true
    if (toUpdateWatched.length) {
      log("toUpdateWatched", {
        repos: toUpdateWatched,
        count: toUpdateWatched.length,
      });
      queries.push(
        this.collection
          .updateMany(
            { name: { $in: toUpdateWatched } },
            { $set: { watched: true } }
          )
          .then(() =>
            toUpdateWatched.forEach((name) => (cacheRepos[name] = true))
          )
      );
    }
    // update watched = false
    if (toUpdateNotWatched.length) {
      log("toUpdateNotWatched", {
        repos: toUpdateNotWatched,
        count: toUpdateNotWatched.length,
      });
      queries.push(
        this.collection
          .updateMany(
            { name: { $in: toUpdateNotWatched } },
            { $set: { watched: false } }
          )
          .then(() =>
            toUpdateNotWatched.forEach((name) => (cacheRepos[name] = false))
          )
      );
    }
    // toInsert new watched
    if (toInsert.length) {
      log("toInsert", { repos: toInsert, count: toInsert.length });
      queries.push(
        this.collection
          .insertMany(
            toInsert.map((name) => ({
              name: name,
              latestTag: "UNKNOWN",
              updatedAt: new Date("1970-01-01T00:00:00Z"),
              watched: true,
            })),
            { ordered: false }
          )
          .catch((r) => r)
          .then(() => toInsert.forEach((name) => (cacheRepos[name] = true)))
      );
    }
    return Promise.all(queries);
  }

  loadOutdated(limit) {
    if (limit < 0) {
      return [];
    }
    return this.collection
      .find(
        {
          watched: true,
          $or: [
            {
              latestTag: { $ne: "" },
              updatedAt: {
                $lt: moment()
                  .add(`-${HOURS_AGO_IS_OUTDATED_WITH_TAGS}`, "hour")
                  .toDate(),
              },
            },
            {
              latestTag: "",
              updatedAt: {
                $lt: moment()
                  .add(`-${HOURS_AGO_IS_OUTDATED_WITHOUT_TAGS}`, "hour")
                  .toDate(),
              },
            },
          ],
        },
        { name: 1 }
      )
      .sort({ updatedAt: 1 })
      .limit(limit)
      .toArray()
      .then((r) => r.map((i) => i.name));
  }

  updateLatestTag(name, latestTag) {
    return this.collection.updateOne(
      { name },
      { $set: { latestTag, updatedAt: new Date() } }
    );
  }
}
