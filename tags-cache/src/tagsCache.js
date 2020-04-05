"use strict";

const moment = require("moment");
let { UPSERT_BATCH_SIZE = 500 } = process.env;
UPSERT_BATCH_SIZE = +UPSERT_BATCH_SIZE;

module.exports.default = class TagsCache {
  constructor(client) {
    this.batch = [];
    this.collection = client.db().collection("tagsCache");
  }

  resetWatched() {
    return this.collection.updateMany({}, { $set: { watched: false } });
  }

  async upsert(name) {
    this.batch.push({
      name: name,
      latestTag: "UNKNOWN",
      updatedAt: new Date("1970-01-01T00:00:00Z"),
      watched: true,
    });
    if (this.batch.length >= UPSERT_BATCH_SIZE) {
      await this.upsertBatch();
      this.batch = [];
    }
  }

  async doneUpserting() {
    if (this.batch.length > 0) {
      await this.upsertBatch();
      this.batch = [];
    }
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
              updatedAt: { $lt: moment().add("-1", "day").toDate() },
            },
            {
              latestTag: "",
              updatedAt: { $lt: moment().add("-3", "day").toDate() },
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

  async upsertBatch() {
    await this.collection.updateMany(
      { name: { $in: this.batch.map((i) => i.name) } },
      { $set: { watched: true } }
    );
    return this.collection
      .insertMany(this.batch, { ordered: false })
      .catch((r) => r);
  }
};
