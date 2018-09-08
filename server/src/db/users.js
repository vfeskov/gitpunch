import { ObjectID } from 'mongodb'
import { connection } from './connection'
const USERS_COLLECTION_NAME = 'users'
const { assign, keys } = Object

const usersCollection = connection.then(db => db.collection(USERS_COLLECTION_NAME))

export async function loadUser (params) {
  const collection = await usersCollection
  const user = await collection.findOne(query(params))
  return normalize(user)
}

export async function createUser (params) {
  const collection = await usersCollection
  const user = assign({}, params, {
    _id: ObjectID(),
    watching: true
  })
  await collection.insertOne(user)
  return normalize(user)
}

export async function updateUser (params, attrs) {
  const collection = await usersCollection
  const update = {}
  if (keys(attrs).some(k => k === '$unset' || k === '$set')) {
    const { $set, $unset } = attrs
    if ($set) { update.$set = $set }
    if ($unset) { update.$unset = $unset }
  } else {
    update.$set = attrs
  }
  return collection.updateOne(
    query(params),
    update
  )
}

export async function addReposToUser (params, repos) {
  const collection = await usersCollection
  collection.updateOne(
    query(params),
    {
      $addToSet: {
        repos: {
          $each: repos
        }
      }
    }
  )
}

export async function removeReposFromUser (params, repos) {
  const collection = await usersCollection
  collection.updateOne(
    query(params),
    {
      $pull: {
        repos: { $in: repos },
        mutedRepos: { $in: repos }
      }
    }
  )
}

export async function removeAllReposFromUser (params) {
  const collection = await usersCollection
  collection.updateOne(
    query(params),
    {
      $set: {
        repos: [],
        mutedRepos: []
      }
    }
  )
}

export async function muteRepoOfUser (params, repo) {
  const collection = await usersCollection
  collection.updateOne(
    query(params),
    {
      $addToSet: {
        mutedRepos: repo
      }
    }
  )
}

export async function unmuteRepoOfUser (params, repo) {
  const collection = await usersCollection
  collection.updateOne(
    query(params),
    {
      $pull: {
        mutedRepos: repo
      }
    }
  )
}

export async function setMutedReposOfUser (params, repos) {
  const collection = await usersCollection
  collection.updateOne(
    query(params),
    {
      $set: {
        mutedRepos: repos
      }
    }
  )
}

export async function loadUsers (params) {
  const collection = await usersCollection
  const users = await collection.find(params).toArray()
  return users.map(normalize)
}

function query ({ id, email }) {
  return id ? { _id: ObjectID(id) } : { email }
}

function normalize (origUser) {
  if (!origUser) {
    return null
  }
  const { _id, ...user } = origUser
  return {
    ...user,
    id: _id.toString(),
    repos: user.repos || [],
    mutedRepos: user.mutedRepos || [],
    frequency: user.frequency || 'realtime',
    checkAt: user.checkAt || 0,
    accessToken: user.accessToken || '',
    watchingStars: user.watchingStars || 0
  }
}
