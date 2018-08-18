import moment from 'moment-timezone'

export const ampmMode = new Date().toLocaleTimeString().toLowerCase().match(/(am|pm)/)

export function fromUTC (utcHour) {
  return moment.utc(utcHour, 'H').local()
}

export function toUTC (hour) {
  return +moment(hour, 'H').utc().format('H')
}

export function fromLocal (hour) {
  return moment(hour, 'H')
}

export function timeText (time) {
  return ampmMode ? time.format('LT') : time.format('HH:mm')
}
