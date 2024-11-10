import * as mongoose from "mongoose";
import log from "../log";

export async function connect() {
  if ([1, 2].includes(mongoose.connection.readyState)) return mongoose.connection;
  return mongoose.connect(process.env.WAB_MONGODB_URL, {
    bufferCommands: false,
  }).then(() => mongoose.connection);
}

export function disconnect() {
  mongoose.disconnect().catch((e) =>
    log("disconnectError", {
      name: e.name,
      message: e.message,
      stack: e.stack,
    })
  );
}
