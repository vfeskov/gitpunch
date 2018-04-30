import url from 'url'
const clientUrl = process.env.WAB_CLIENT_HOST
const clientHost = url.parse(clientUrl).host

export default function redirectToMainDomain (req, res, next) {
  const { host = '' } = req.headers
  if (
    host.startsWith('localhost') ||
    host === clientHost
  ) {
    return next()
  }
  res.writeHead(301, { Location: clientUrl + req.url })
  res.end()
}
