import { fetchAtom, trackFetchErrors } from "gitpunch-lib/githubAtom.js";
import shuffle from "gitpunch-lib/shuffle.js";
import { RepoGroup, RepoGroupWithTags } from "./interfaces";
import getCachedTags from "./getCachedTags.js";

let { MAX_TAGS_TO_FETCH = 500 } = process.env;

export default async function fetchTags(byRepo: RepoGroup[]) {
  const errors = trackFetchErrors();
  let shuffled = shuffle(byRepo);
  let toFetchFromCache = [];
  if (shuffled.length > +MAX_TAGS_TO_FETCH) {
    toFetchFromCache = shuffled.slice(+MAX_TAGS_TO_FETCH);
    shuffled = shuffled.slice(0, +MAX_TAGS_TO_FETCH);
  }
  const result: RepoGroupWithTags[] = [];

  for (const { repo, users } of shuffled) {
    try {
      const url = `https://github.com/${repo}/tags.atom`;
      const tags = await fetchAtom(url, false);
      result.push({ repo, users, tags });
    } catch (error) {
      result.push({ repo, users, tags: [] });
      errors.push(repo, error);
    }
  }

  if (toFetchFromCache.length) {
    const cachedTags = await getCachedTags(byRepo);
    for (const { repo, users } of toFetchFromCache) {
      result.push({
        repo,
        users,
        tags: [{ name: cachedTags[repo], entry: "" }],
      });
    }
  }

  errors.log("fetchTagsErrors");
  return result;
}
