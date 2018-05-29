import { ObjectID } from 'mongodb'
import { connection } from './connection'
const USERS_COLLECTION_NAME = 'users'
const { assign, keys } = Object

const usersCollection = connection.then(db => db.collection(USERS_COLLECTION_NAME))

export async function loadUser (params) {
  const collection = await usersCollection
  const user = await collection.findOne(query(params))
  return withId(user)
}

export async function createUser (params) {
  const collection = await usersCollection
  const user = assign({}, params, {
    _id: ObjectID(),
    watching: true
  })
  await collection.insertOne(user)
  return withId(user)
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

export async function removeRepoFromUser (params, repo) {
  const collection = await usersCollection
  collection.updateOne(
    query(params),
    {
      $pull: {
        repos: repo
      }
    }
  )
}

function query ({ id, email }) {
  return id ? { _id: ObjectID(id) } : { email }
}

function withId (user) {
  return user && assign(user, { id: user._id.toString() })
}
