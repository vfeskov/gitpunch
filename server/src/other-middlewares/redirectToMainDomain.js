import url from 'url'
const clientHost = url.parse(process.env.WAB_CLIENT_HOST).host

export default function redirectToMainDomain (req, res, next) {
  const { host = '' } = req.headers
  if (
    host.startsWith('localhost') ||
    host === clientHost
  ) {
    return next()
  }
  res.writeHead(301, { Location: CLIENT_HOST + req.url })
  res.end()
}
