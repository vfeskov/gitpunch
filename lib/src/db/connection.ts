import * as mongoose from "mongoose";
import log from "../log";

export function connect() {
  if (mongoose.connection) return mongoose.connection;
  return mongoose.connect(process.env.WAB_MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferMaxEntries: 0,
  });
}

export const connection = connect();

export function disconnect() {
  mongoose.disconnect().catch((e) =>
    log("disconnectError", {
      name: e.name,
      message: e.message,
      stack: e.stack,
    })
  );
}
