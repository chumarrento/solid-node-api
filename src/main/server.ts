import 'module-alias/register'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(e => console.error(e))
