import { loadAccessTokens } from "gitpunch-lib/db";
import log, { debug } from "gitpunch-lib/log";
import fetch from "node-fetch";
import { SQS } from "aws-sdk";
import { Agent } from "https";
// how often to fetch events in seconds
const INTERVAL = +process.env.WAB_EVENTS_MONITORING_INTERVAL || 1;

const PER_PAGE = 100;
const PAGES = 3;
// how often github resets rate limit in seconds
const CYCLE = process.env.WAB_EVENTS_MONITORING_CYCLE || 3600;
const SQS_QUEUE_URL = process.env.WAB_SQS_QUEUE_URL;
const TRACK_EVENTS_FOR_DUPLICATES =
  +process.env.WAB_TRACK_EVENTS_FOR_DUPLICATES || 200;

let prevEvents = [];
export async function monitor() {
  debug("monitorStart");
  const fetchStartTime = now();
  try {
    debug("pickAccessToken");
    const accessToken = await pickAccessToken();

    debug("fetchEvents");
    const events = await fetchEvents(accessToken);

    // keep only release/tag events
    debug("filterAndMapReleases");
    const releases = filterAndMapReleases(events);

    // filter out duplicates
    debug("deduped");
    const deduped = releases
      .filter((e, _, self) => self.find((_e) => _e.id === e.id) === e)
      .filter((e) => prevEvents.every((prevE) => prevE.id !== e.id));

    debug("monitor", {
      duration: now() - fetchStartTime,
      events: events.length,
      releases: releases.length,
      deduped: deduped.length,
    });

    deduped.forEach(sendEventToQueue);

    prevEvents = prevEvents.concat(deduped);
    if (prevEvents.length > TRACK_EVENTS_FOR_DUPLICATES) {
      prevEvents = prevEvents.slice(
        prevEvents.length - TRACK_EVENTS_FOR_DUPLICATES
      );
    }
  } catch (e) {
    log("monitorError", { error: e.stack });
  }
  const delay = timeUntilNextFetch(fetchStartTime);
  debug("monitorNextCycleDelay", { delay });
  setTimeout(monitor, delay);
  debug("monitorNextCycleScheduled");
}

const agents = Array.from(Array(PAGES)).map(
  () => new Agent({ keepAlive: true })
);
const paginatedApiUrls = (() => {
  const baseUrl = "https://api.github.com/events";
  return Array.from(Array(PAGES)).map(
    (_, i) => `${baseUrl}?per_page=${PER_PAGE}&page=${i + 1}`
  );
})();
async function fetchEvents(accessToken) {
  const pages = await Promise.all(
    paginatedApiUrls.map(async (url, index) => {
      try {
        const response = await fetch(url, {
          agent: agents[index],
          headers: { Authorization: `token ${accessToken}` },
          timeout: 1000,
        });
        if (response.status !== 200) {
          throw new Error(`GitHub says ${response.status}`);
        }
        const events = await response.json();
        if (eventsValid(events)) return events;
        throw new Error("GitHub sends gibberish");
      } catch (e) {
        log("fetchEventsError", { error: e.stack });
        return [];
      }
    })
  );
  return pages
    .reduce((r, p) => [...r, ...p], [])
    .sort((e1, e2) => e2.id - e1.id);
}

async function pickAccessToken() {
  const accessTokens = await loadAccessTokens();
  const nowInSeconds = Math.floor(now() / 1000);
  const cycleSecondIndex = nowInSeconds % (CYCLE / INTERVAL);
  const turn = cycleSecondIndex % accessTokens.length;
  return accessTokens[turn];
}

function filterAndMapReleases(events) {
  return events
    .filter(
      (e) =>
        e.type === "ReleaseEvent" ||
        (e.type === "CreateEvent" && e.payload.ref_type === "tag")
    )
    .map(({ type, repo, payload, created_at }) => {
      const tagName =
        type === "ReleaseEvent" ? payload.release.tag_name : payload.ref;
      return {
        id: `${repo.name}@${tagName}`,
        repoName: repo.name,
        tagName,
        createdAt: created_at,
      };
    });
}

const sqs = new SQS({
  apiVersion: "2012-11-05",
  region: process.env.WAB_SQS_REGION,
});
function sendEventToQueue(message) {
  debug("sendEventToQueue", message);
  sqs.sendMessage(
    {
      MessageBody: JSON.stringify(message),
      QueueUrl: SQS_QUEUE_URL,
    },
    (err, data) => err && log("sendEventToQueueError", { message, error: err })
  );
}

function timeUntilNextFetch(fetchStartTime) {
  const nextOnSchedule = fetchStartTime + INTERVAL * 1000;
  const nowTs = now();
  if (nowTs > nextOnSchedule) {
    return 0;
  }
  return nextOnSchedule - nowTs;
}

function now() {
  return new Date().getTime();
}

function eventsValid(events) {
  return (
    Array.isArray(events) && events.every((e) => e && e.id && !isNaN(e.id))
  );
}
