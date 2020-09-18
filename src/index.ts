import http from 'http'
import { config } from './config'
import { App } from './app'

const app = App(config)

http
.createServer(app)
.listen(config.port)
