import { MongoClient } from "mongodb";
import { RepoGroup } from "./interfaces";
import log from "gitpunch-lib/log";
import getCachedTags from "./getCachedTags";

export default async function filterOutIrrelevantRepos(
  client: MongoClient,
  byRepo: RepoGroup[]
) {
  const latestTag = await getCachedTags(client, byRepo);
  const result = byRepo.filter((group) => {
    let alertedTags = [
      ...new Set(
        group.users
          .map((u) => u.alerted[group.repo])
          .filter((i) => i !== undefined)
      ),
    ];
    if (!alertedTags.length || alertedTags.length > 1) {
      return true;
    }
    return latestTag[group.repo] !== alertedTags[0];
  });
  log("uniqueReposDetails", { repos: result.map((r) => r.repo) });
  log("uniqueRepos", { count: result.length });
  return result;
}
