import { RepoGroup } from "./interfaces";
import log from "gitpunch-lib/log.js";
import getCachedTags from "./getCachedTags.js";

export default async function filterOutIrrelevantRepos(byRepo: RepoGroup[]) {
  const latestTag = await getCachedTags(byRepo);
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
