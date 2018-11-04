const http = require('http');
const { SERVER_URL } = process.env;
const TIMEOUT = 600000;
const startTS = Date.now();
console.log(`Waiting for server to start on ${SERVER_URL}`);
(function ping () {
  if (Date.now() - startTS > TIMEOUT) {
    process.exit(1)
  }
  http.get(SERVER_URL).on('error', ping);
}());
