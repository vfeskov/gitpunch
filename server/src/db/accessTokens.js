import { connection } from './connection'
const ACCESS_TOKENS_COLLECTION_NAME = 'accessTokens'
const CACHE_TTL = 600000 // ms

let prevLoadTS = 0;
let cachePromise;

export function loadAccessTokens () {
  const now = new Date().getTime()
  if (!cachePromise || now - prevLoadTS > CACHE_TTL){
    cachePromise = load()
  }
  return cachePromise.then(items => items.map(i => i.accessToken))
}

async function load () {
  const db = await connection
  const collection = await db.collection(ACCESS_TOKENS_COLLECTION_NAME)
  return collection.find({}, { projection: { accessToken: 1 } }).toArray()
}
