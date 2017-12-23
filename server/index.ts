import { config } from 'dotenv'
config()
import './rxjs'
import { Server } from 'hapi'
import * as auth from './plugins/auth'
import * as profile from './plugins/profile'

const server = new Server()
server.connection({ port: process.env.PORT || 3000 })

const plugins = [
  auth,
  profile,
]

if (process.env.NODE_ENV === 'production') {
  const staticContent = require('./plugins/static-content')
  const reactServerSide = require('./plugins/react-server-side')

  plugins.push(
    staticContent,
    reactServerSide
  )
}

server.register(plugins).then(() => {
  server.start(() => {
    console.log('Server running at: ', server.info.uri)
  })
}, console.error)
