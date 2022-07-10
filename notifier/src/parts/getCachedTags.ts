import { MongoClient } from "mongodb";

let cache: Promise<{ [name: string]: string }> = null;

export default async function getCachedTags(
  client: MongoClient,
  repos: Array<{ repo: string }>
) {
  if (!cache) {
    cache = client
      .db()
      .collection("tagsCache")
      .find({ name: { $in: repos.map((i) => i.repo) } }, {
        name: 1,
        latestTag: 1,
      } as any)
      .toArray()
      .then(
        (items) =>
          items.reduce(
            (r, i) => Object.assign(r, { [i.name]: i.latestTag }),
            {}
          ),
        () => (cache = null)
      );
  }
  return cache;
}
