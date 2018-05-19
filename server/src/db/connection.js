import { MongoClient } from 'mongodb'
const URL = process.env.WAB_MONGODB_URL
const DB_NAME = process.env.WAB_MONGODB_DBNAME

export const connection = (async () => {
  const client = await MongoClient.connect(URL)
  return client.db(DB_NAME)
})()
