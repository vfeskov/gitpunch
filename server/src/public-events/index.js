import { loadAccessTokens } from '../db'
import fetch from 'node-fetch'
// how often to fetch events in seconds
const INTERVAL = process.env.WAB_EVENTS_MONITORING_INTERVAL || 1
// how many pages of events to fetch every iteration (30 per page)
const PAGES = process.env.WAB_EVENTS_MONITORING_PAGES || 5
// how often github resets rate limit in seconds
const CYCLE = process.env.WAB_EVENTS_MONITORING_CYCLE || 3600

let prevEvents = []
export async function monitor () {
  const fetchStartTime = now()
  try {
    const accessToken = await pickAccessToken()
    const events = await fetchEvents(accessToken)
    events
      .filter(e => e.type === 'ReleaseEvent')
      .filter(e => prevEvents.every(prevE => prevE.id !== e.id))
      .forEach(e => {
        // TODO: send emails to users instead of console.log
        console.log(`New Release: ${e.repo.name}@${e.payload.release.tag_name}`)
      })
    prevEvents = events
  } catch (e) {
    console.log('Error' + e.message, e.stack)
  }
  setTimeout(monitor, timeUntilNextFetch(fetchStartTime))
}

const paginatedApiUrls = (() => {
  const baseUrl = 'https://api.github.com/events'
  return [baseUrl, ...Array.from(Array(PAGES - 1)).map((v, i) =>
    `${baseUrl}?page=${i + 2}`
  )]
})()
async function fetchEvents (accessToken) {
  const pages = await Promise.all(paginatedApiUrls.map(async url => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `token ${accessToken}` },
        timeout: INTERVAL * 2000
      })
      if (response.status !== 200) {
        throw new Error(`GitHub says ${response.status}`)
      }
      const events = await response.json()
      if (eventsValid(events)) {
        return events
      }
      throw new Error('GitHub sends gibberish')
    } catch (e) {
      console.error('Fetch Error: ' + e.message)
      return []
    }
  }))
  return pages
    .reduce((r, p) => [...r, ...p], [])
    .sort((e1, e2) => e2.id - e1.id)
    .filter((e, i, self) => self.find(_e => _e.id === e.id) === e)
}

async function pickAccessToken () {
  const accessTokens = await loadAccessTokens()
  const nowInSeconds = Math.floor(now() / 1000)
  const cycleSecondIndex = nowInSeconds % (CYCLE / INTERVAL)
  const turn = cycleSecondIndex % accessTokens.length
  return accessTokens[turn]
}

function timeUntilNextFetch (fetchStartTime) {
  const nextOnSchedule = fetchStartTime + INTERVAL * 1000
  if (now() > nextOnSchedule) {
    return 0
  }
  return nextOnSchedule - now()
}

function now () {
  return new Date().getTime()
}

function eventsValid (events) {
  return Array.isArray(events) && events.every(e => e && e.id && !isNaN(e.id))
}
