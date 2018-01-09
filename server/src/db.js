import { MongoClient, ObjectID } from 'mongodb'
const url = process.env.WAB_MONGODB_URL
const dbName = process.env.WAB_MONGODB_DBNAME
const collectionName = process.env.WAB_MONGODB_COLLECTIONNAME
const { assign } = Object

const collectionPrms = (async () => {
  const client = await MongoClient.connect(url)
  return client.db(dbName).collection(collectionName)
})()

export async function load (params) {
  const collection = await collectionPrms
  const user = await collection.findOne(query(params))
  return withId(user)
}

export async function create (email, passwordEncrypted, repos) {
  const collection = await collectionPrms
  const _id = ObjectID()
  const user = {
    _id,
    email,
    passwordEncrypted,
    repos,
    watching: true,
    alerted: {}
  }
  await collection.insertOne(user)
  return withId(user)
}

export async function update (params, attrs) {
  const collection = await collectionPrms
  return collection.updateOne(
    query(params),
    { $set: attrs }
  )
}

function query ({ id, email }) {
  return id ? { _id: ObjectID(id) } : { email }
}

function withId (user) {
  return user && assign(user, { id: user._id.toString() })
}
