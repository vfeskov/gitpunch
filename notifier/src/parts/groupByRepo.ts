import { DBUser, RepoGroup } from "./interfaces";
const { keys } = Object;

export default function groupByRelevantRepo(dbUsers: DBUser[]): RepoGroup[] {
  const byRepo = dbUsers.reduce((byRepo, dbUser) => {
    dbUser.repos.forEach((repo) => {
      byRepo[repo] = byRepo[repo] || { repo, users: [], alertedTags: [] };
      const { repos, ...user } = dbUser;
      byRepo[repo].users.push(user);
    });
    return byRepo;
  }, {});
  const repos = keys(byRepo);
  if (!repos.length) {
    return [];
  }
  return repos.map((r) => byRepo[r]);
}
