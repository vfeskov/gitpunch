import './connection'
import * as mongoose from 'mongoose'

const AccessTokenSchema = new mongoose.Schema({accessToken: String})
export const AccessTokenModel = mongoose.model('AccessToken', AccessTokenSchema)

const CACHE_TTL = 600000 // ms

let prevLoadTS = 0;
let cachePromise;

export function loadAccessTokens () {
  const now = new Date().getTime()
  if (!cachePromise || now - prevLoadTS > CACHE_TTL){
    cachePromise = AccessTokenModel.find({})
  }
  return cachePromise.then(items => items.map(i => i.accessToken))
}
