import { config } from 'dotenv'
config()
import './rxjs'
import { Server } from 'hapi'
import * as auth from './plugins/auth'
import * as profile from './plugins/profile'
import * as staticContent from './plugins/static-content'

const server = new Server()
server.connection({ port: process.env.PORT || 3000 })

server.register([auth, profile, staticContent]).then(() => {
  server.start(() => {
    console.log('Server running at: ', server.info.uri)
  })
}, console.error)
