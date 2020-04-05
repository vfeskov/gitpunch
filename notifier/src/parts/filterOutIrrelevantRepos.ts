import { MongoClient } from "mongodb";
import { RepoGroup } from "./interfaces";
import log from "gitpunch-lib/log";

export default async function filterOutIrrelevantRepos(client: MongoClient, byRepo: RepoGroup[]) {
  const latestTag = await client
    .db()
    .collection('tagsCache')
    .find({ name: { $in: byRepo.map(i => i.repo) } }, { name: 1, latestTag: 1 } as any)
    .toArray()
    .then(items => items.reduce((r, i) => Object.assign(r, { [i.name]: i.latestTag }), {}));
  const result = byRepo.filter(group => {
    let alertedTags = [...new Set(group.users.map(u => u.alerted[group.repo]).filter(i => i !== undefined))];
    if (!alertedTags.length || alertedTags.length > 1) {
      return true;
    }
    return latestTag[group.repo] !== alertedTags[0];
  });
  log('uniqueReposDetails', { repos: result });
  log('uniqueRepos', { count: result.length });
  return result;
}
