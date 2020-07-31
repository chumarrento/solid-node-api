import request from 'supertest'
import app from '../config/app'

describe('Sign Up Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Test Name',
        email: 'test_email@email.com',
        password: 'secret',
        passwordConfirmation: 'secret'
      })
      .expect(200)
  })
})
