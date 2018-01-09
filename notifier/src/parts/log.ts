export default function log (event, data?) {
  console.log(JSON.stringify({ event, data, timestamp: Date.now() }))
}
