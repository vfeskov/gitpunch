// Reusable service to work with GitHub's Atom feeds
import fetch from "node-fetch";
import { Agent } from "https";
import log from "./log";
import timeout from "./timeout";

export const FETCH_ATTEMPTS = 3;
export const FETCH_ATTEMPTS_INTERVAL = 60000;
export const FETCH_TIMEOUT = 10000;
export const KEEP_ALIVE_MSECS = 120000;

let agent: Agent;
let _totalRequests = 0;
let _trackTotalRequests = false;

export function fetchTags(repo: string) {
  return fetchAtom(`https://github.com/${repo}/tags.atom`, false);
}

export async function fetchAtom(url: string, includeEntry: boolean) {
  let error = new Unknown();
  let success;
  let attempts = 0;
  agent =
    agent || new Agent({ keepAlive: true, keepAliveMsecs: KEEP_ALIVE_MSECS });
  while (attempts < FETCH_ATTEMPTS) {
    try {
      attempts++;
      const response = await fetch(url, { agent, timeout: FETCH_TIMEOUT });
      const { status } = response;
      if (status >= 400 && status < 500) {
        throw new BadRequest();
      }
      if (status !== 200) {
        throw new BadResponse(status);
      }
      const xml = await response.text();
      success = parse(xml, includeEntry);
      break;
    } catch (e) {
      error = e;
      await timeout(FETCH_ATTEMPTS_INTERVAL);
    }
  }
  if (_trackTotalRequests) {
    _totalRequests += attempts;
  }
  if (success) {
    return success;
  }
  throw error;
}

export function trackTotalRequests() {
  _trackTotalRequests = true;
  _totalRequests = 0;
}

export function logTotalRequests() {
  _totalRequests && log("totalRequests", { count: _totalRequests });
}

export function trackFetchErrors() {
  const errors: BaseError[] = [];
  return {
    errors() {
      return errors;
    },
    push(repo: string, error: BaseError) {
      error.repo = repo;
      errors.push(error);
    },
    log(logPrefix: string) {
      if (!errors.length) {
        return;
      }
      const r: { [key: string]: any[] } = {
        BadResponse: [],
        BadRequest: [],
        Other: [],
      };
      errors.forEach((e) => {
        if (e instanceof BadResponse) {
          r.BadResponse.push([e.repo, e.status]);
        } else if (e instanceof BadRequest) {
          r.BadRequest.push(e.repo);
        } else {
          r.Other.push([e.repo, e.stack]);
        }
      });
      Object.keys(r)
        .filter((k) => r[k].length)
        .forEach((k) => {
          log(logPrefix + k, { count: r[k].length });
          log(logPrefix + k + "Details", { errors: r[k] });
        });
    },
  };
}

export function closeConnections() {
  agent && agent.destroy();
  agent = null;
}

export class BaseError extends Error {
  repo: string;
}

export class Unknown extends BaseError {
  message = "unknown";
}

export class BadResponse extends BaseError {
  constructor(public status: number) {
    super("bad response");
  }
}

export class BadRequest extends BaseError {
  message = "bad request";
}

const ENTRY_REGEXP = /<entry>[\s\S]*?<\/entry>/gm;
const ID_REGEXP = new RegExp("<id>[^<]+/([^/<]+)</id>");

function parse(xml: string, includeEntry: boolean) {
  return (xml.match(ENTRY_REGEXP) || [])
    .map((entry) => {
      const match = entry.match(ID_REGEXP);
      if (!match) {
        return;
      }
      return {
        name: match[1],
        entry: includeEntry ? entry : "",
      };
    })
    .filter(Boolean);
}
