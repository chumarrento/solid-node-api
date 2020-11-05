import { Express } from 'express'
import { bodyParser, cors, contentType, noCache } from '@/main/middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(noCache)
}
