import { MongoClient, ObjectID } from 'mongodb'
const url = process.env.WAB_MONGODB_URL
const dbName = process.env.WAB_MONGODB_DBNAME
const collectionName = process.env.WAB_MONGODB_COLLECTIONNAME
const { assign, keys } = Object

const collectionPrms = (async () => {
  const client = await MongoClient.connect(url)
  return client.db(dbName).collection(collectionName)
})()

export async function load (params) {
  const collection = await collectionPrms
  const user = await collection.findOne(query(params))
  return withId(user)
}

export async function create (params) {
  const collection = await collectionPrms
  const _id = ObjectID()
  const user = assign({}, params, {
    _id,
    watching: true
  })
  await collection.insertOne(user)
  return withId(user)
}

export async function update (params, attrs) {
  const collection = await collectionPrms
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

function query ({ id, email }) {
  return id ? { _id: ObjectID(id) } : { email }
}

function withId (user) {
  return user && assign(user, { id: user._id.toString() })
}
