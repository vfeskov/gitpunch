import "dotenv/config";
import { handler } from "./build/index.js";
handler(null, null, console.log);
