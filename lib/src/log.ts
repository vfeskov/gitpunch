export default function log (event: string, data = {}) {
  console.log(JSON.stringify({ event, ...data, timestamp: Date.now() }))
}
