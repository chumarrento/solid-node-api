import 'module-alias/register'
import app from './config/app'
import env from './config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(e => console.error(e))
