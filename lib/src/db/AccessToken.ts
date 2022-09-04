import "./connection.js";
import mongoose from "mongoose";

const AccessTokenSchema = new mongoose.Schema(
  { accessToken: { type: String, required: true } },
  { bufferCommands: false }
);
export const AccessTokenModel = mongoose.model(
  "AccessToken",
  AccessTokenSchema,
  "accessTokens"
);

const CACHE_TTL = 600000; // ms

let prevLoadTS = 0;
let cachePromise: Promise<string[]>;

export function loadAccessTokens() {
  const now = new Date().getTime();
  if (!cachePromise || now - prevLoadTS > CACHE_TTL) {
    cachePromise = AccessTokenModel.find({}).then((items: AccessToken[]) =>
      items.map((i) => i.accessToken)
    );
  }
  return cachePromise;
}

interface AccessToken extends mongoose.Document {
  accessToken: string;
}
