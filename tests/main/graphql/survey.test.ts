import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import { makeApolloServer } from './helpers'

import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import Mockdate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection
let apolloServer: ApolloServer

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Test Name',
    email: 'test_email@email.com',
    password: 'test_password',
    role: 'admin'
  })
  const id = res.ops[0]._id
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
    Mockdate.set(new Date())

    apolloServer = makeApolloServer()

    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    Mockdate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const surveysQuery = gql`
        query surveys {
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
        }
    `

    test('Should return surveys on success', async () => {
      const accessToken = await mockAccessToken()
      await createSurveys()
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveysQuery)
      expect(res.data.surveys.length).toBe(1)
      expect(res.data.surveys[0].id).toBeTruthy()
      expect(res.data.surveys[0].question).toBe('any_question')
      expect(res.data.surveys[0].date).toBe(new Date().toISOString())
      expect(res.data.surveys[0].didAnswer).toBe(false)
      expect(res.data.surveys[0].answers).toEqual([{
        image: 'any_image',
        answer: 'any_answer'
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      await createSurveys()
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(surveysQuery)
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('AccessDeniedError: Access Denied.')
    })
  })
})
