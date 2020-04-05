"use strict";

const moment = require("moment");
const log = require("gitpunch-lib/log").default;
let {
  HOURS_AGO_IS_OUTDATED_WITH_TAGS = 24,
  HOURS_AGO_IS_OUTDATED_WITHOUT_TAGS = 72,
} = process.env;

module.exports.default = class TagsCache {
  constructor(client) {
    this.collection = client.db().collection("tagsCache");
    this.cacheRepos = {};
    this.toUpdateWatched = [];
    this.toUpdateNotWatched = [];
    this.toInsert = [];
  }

  async loadAll() {
    const then = moment();
    this.cacheRepos = await this.collection
      .find({}, { name: 1, watched: 1 })
      .toArray()
      .then((items) =>
        items.reduce((r, i) => Object.assign(r, { [i.name]: i.watched }), {})
      );
    log("tagsCacheLoadAll", { duration: moment().diff(then, "ms") });
  }

  addWatchedRepo(name) {
    if (!this.cacheRepos.hasOwnProperty(name)) {
      this.toInsert.push(name);
    } else if (!this.cacheRepos[name]) {
      this.toUpdateWatched.push(name);
    }
    delete this.cacheRepos[name];
  }

  updateWatched() {
    const { cacheRepos, toUpdateWatched, toUpdateNotWatched, toInsert } = this;

    for (let name in cacheRepos) {
      if (cacheRepos[name]) {
        toUpdateNotWatched.push(name);
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
        this.collection.updateMany(
          { name: { $in: toUpdateWatched } },
          { $set: { watched: true } }
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
        this.collection.updateMany(
          { name: { $in: toUpdateNotWatched } },
          { $set: { watched: false } }
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
};
