import { URL } from 'url'
const hostUrl = process.env.WAB_CLIENT_HOST

export default function globalLocation () {
  global.location = new URL(hostUrl)
}
