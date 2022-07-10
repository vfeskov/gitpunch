export default function log(event: string, data = {}) {
  console.log(
    JSON.stringify({ event, ...data, timestamp: new Date().toISOString() })
  );
}

export function debug(event: string, data = {}) {
  if (process.env.DEBUG !== "true") return;
  log(event, data);
}
