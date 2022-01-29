import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'

import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import Mockdate from 'mockdate'
import { Express } from 'express'

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Test Name',
    email: 'test_email@email.com',
    password: 'test_password',
    role: 'admin'
  })
  const id = res.insertedId
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

const createSurveys = async (): Promise<void> => {
  await surveyCollection.insertMany([{
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }])
}

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    Mockdate.set(new Date())

    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    Mockdate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          image
          answer
        }
        date
        didAnswer
      }
    }`

    test('Should return surveys on success', async () => {
      const accessToken = await mockAccessToken()
      await createSurveys()

      const res = await request(app).post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe('any_question')
      expect(res.body.data.surveys[0].date).toBe(new Date().toISOString())
      expect(res.body.data.surveys[0].didAnswer).toBe(false)
      expect(res.body.data.surveys[0].answers).toEqual([{
        image: 'any_image',
        answer: 'any_answer'
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      await createSurveys()
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('AccessDeniedError: Access Denied.')
    })
  })
})
