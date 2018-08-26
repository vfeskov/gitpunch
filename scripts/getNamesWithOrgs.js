/**
 * Gets the list of repo names, for which it makes sense to include org name in email subject:
 *   1. More than one org has it
 *   2. Forks are filtered out
 *   3. Renamed repos are filtered out
 * Expects allUniqueReposFromDb.json to have unique repos from all users in the db already
 * Result is logged in the console
 */
const fetch = require('node-fetch');
const allUniqueReposFromDb = require('./allUniqueReposFromDb.json')

work();

async function work() {
  const duplicateNames1 = getDuplicateNames(allUniqueReposFromDb);
  const repos = duplicateNames1.reduce((r, i) => {
    r.push(...i.repos);
    return r;
  }, []);
  const notForks = [];

  for(let i = 0; i < repos.length; i++) {
    if (i % 50 === 0) {
      console.log(`repo #${i}`);
    }
    const repo = repos[i];
    const response = await fetch(`https://api.github.com/repos/${repo}?access_token=${process.env.ACCESS_TOKEN}`);
    if (response.status !== 200) {
      console.error(`${repo} status ${response.status}`)
    }
    const body = await response.json();
    if (!body.parent && !notForks.includes(body.full_name)) {
      notForks.push(body.full_name);
      console.log(body.full_name);
    }
  };
  const duplicateNames2 = getDuplicateNames(notForks);
  console.log(JSON.stringify(duplicateNames2.map(n => n.name)));
}

function getDuplicateNames(uniqueRepos) {
  const countsMap = uniqueRepos.reduce((r, u) => {
    const n = u.split('/')[1];
    r[n] = r[n] || {count: 0, repos: []};
    r[n].count++;
    r[n].repos = r[n].repos || [];
    r[n].repos.push(u);
    return r;
  }, {});
  return Object.keys(countsMap).reduce((r, n) => {
    if (countsMap[n].count > 2) {
      r.push({...countsMap[n], name: n});
    }
    return r;
  }, []);
}
