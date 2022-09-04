import mongoose from "mongoose";
import log from "../log.js";

export function connect() {
  return mongoose.connect(process.env.WAB_MONGODB_URL);
}

export const connection = mongoose.connection;

export function disconnect() {
  return mongoose.disconnect().catch((e) =>
    log("disconnectError", {
      name: e.name,
      message: e.message,
      stack: e.stack,
    })
  );
}
