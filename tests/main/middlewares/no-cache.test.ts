import { noCache } from '@/main/middlewares'
import { setupApp } from '@/main/config/app'

import request from 'supertest'

describe('No Cache Middleware', () => {
  test('Should disable cache', async () => {
    const app = await setupApp()
    app.get('/test_no_cache', noCache, (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_no_cache')
      .expect('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('Pragma', 'no-cache')
      .expect('Expires', '0')
      .expect('Surrogate-Control', 'no-store')
  })
})
