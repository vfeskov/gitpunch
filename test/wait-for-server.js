const http = require('http');

const TIMEOUT = 300000;

const startTS = Date.now();

console.log('Waiting for server to start on http://localhost:3000');

(function ping () {
  if (Date.now() - startTS > TIMEOUT) {
    process.exit(1)
  }
  http.get('http://localhost:3000').on('error', ping);
}());
