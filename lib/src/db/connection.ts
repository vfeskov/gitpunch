import * as mongoose from 'mongoose'
import log from '../log';

export const connection = mongoose.connect(process.env.WAB_MONGODB_URL, { useNewUrlParser: true })

export function disconnect() {
  return connection.then(con => con.disconnect(), e => log('disconnectError', { name: e.name, message: e.message, stack: e.stack }));
}
