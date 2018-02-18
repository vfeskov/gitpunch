import log from './log'
const NS_PER_SEC = 1e9
const NS_PER_MS = 1e6

let time

export function start () {
  time = process.hrtime()
}

export function finish () {
  const diff = process.hrtime(time);
  log('durationMilliseconds', (diff[0] * NS_PER_SEC + diff[1]) / NS_PER_MS)
}
