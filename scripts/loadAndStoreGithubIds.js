'use strict';

const { User, UserModel, disconnect } = require('gitpunch-lib/db');
const fetch = require('node-fetch');
const fs = require('fs');
const { ObjectID } = require('mongodb');

go();

async function go() {
  await loadAndStoreGithubIds();
  await deleteUsersWithDuplicateGithubIds();
  // await restoreDeletedUsers();
  await disconnect();
}

async function loadAndStoreGithubIds() {
  try {
    const users = await User.find({ accessToken: { $exists: true, $ne: '' }, githubId: { $in: [0, null] } });
    console.log(`Users to load: ${users.length}`)
    for (let user of users) {
      try {
        const response = await fetch(`https://api.github.com/user?access_token=${user.accessToken}`);
        if (response.status === 401) {
          await user.update({ accessToken: '', watchingStars: 0 })
          throw new Error('Revoked token')
        }
        if (response.status !== 200) {
          throw new Error(`Response status ${response.status}`);
        }
        const { id: githubId } = await response.json();
        const errors = user.validate({ githubId });
        if (errors) {
          throw new Error(errors);
        }
        await user.update({ githubId });
        console.log(`User ${user.id}: SUCCESS`)
      } catch (e) {
        console.error(`User ${user.id}: Error ${e.message}`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function deleteUsersWithDuplicateGithubIds() {
  const aggregation = await UserModel.aggregate([
    {
      $group: {
        _id: { githubId: "$githubId" },
        users: { $push: "$$ROOT" },
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        count: { "$gt": 1 },
        "_id.githubId": {
          "$not" : {
            "$in": [null, 0]
          }
        }
      }
    }
  ]);
  let usersToDelete = [];
  for (let { _id, users } of aggregation) {
    const { githubId } = _id;
    const watching = users.reduce((r, u) => u.watching ? [...r, u] : r, []);
    const haveRepos = users.reduce((r, u) => u.repos && u.repos.length ? [...r, u] : r, []);
    let finalUser;
    if (watching.length === 1) {
      finalUser = watching[0];
    } else if (haveRepos.length === 1) {
      finalUser = haveRepos[0];
    } else if (watching.length === 0) {
      finalUser = users.sort((a, b) => a._id.getTimestamp() < b._id.getTimestamp())[0];
    } else {
      // luckily at the moment of writing there were no such users
      console.error(`Not sure what to do here, githubId: ${githubId}, users: [${users.map(u => u._id).join(',')}]`);
      continue;
    }
    usersToDelete = [...usersToDelete, ...users.filter(u => u !== finalUser)];
  }
  fs.writeFileSync(__dirname + '/deletedUsersWithDuplicateGithubIds.json', JSON.stringify(usersToDelete, null, 2));
  const result = await UserModel.deleteMany({ _id: { $in: usersToDelete.map(u => u._id) }});
  console.log(result);
}

async function restoreDeletedUsers() {
  const users = JSON.parse(fs.readFileSync(__dirname + '/deletedUsersWithDuplicateGithubIds.json'));
  for (let user of users) {
    user._id = new ObjectID(user._id);
  }
  await UserModel.insertMany(users);
}
