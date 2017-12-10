module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{json,ico,html,js,css,woff2,woff}"
  ],
  "swSrc": "./src/service-worker.js",
  "swDest": "build/service-worker.js",
  "globIgnores": [
    "../workbox-cli-config.js",
    "asset-manifest.json",
    "index.html"
  ]
};
