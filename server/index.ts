import { config } from 'dotenv'
config()
import './rxjs'
import { Server } from 'hapi'
import * as auth from './plugins/auth'
import * as profile from './plugins/profile'
import * as staticContent from './plugins/static-content'
import * as reactServerSide from './plugins/react-server-side'

const server = new Server()
server.connection({ port: process.env.PORT || 3000 })

const plugins = [
  auth,
  profile,
  staticContent,
  process.env.NODE_ENV === 'production' ? reactServerSide : null
].filter(p => p)

server.register(plugins).then(() => {
  server.start(() => {
    console.log('Server running at: ', server.info.uri)
  })
}, console.error)
