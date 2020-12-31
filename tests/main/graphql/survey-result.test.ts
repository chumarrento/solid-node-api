import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'
import { SurveyModel } from '@/domain/models'
import { makeApolloServer } from './helpers'

import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import Mockdate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection
let apolloServer: ApolloServer

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Test Name',
    email: 'test_email@email.com',
    password: 'test_password'
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

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  return MongoHelper.map(res.ops[0])
}

describe('Survey Result GraphQL', () => {
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

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
        query surveyResult ($surveyId: String!) {
          surveyResult (surveyId: $surveyId) {
            surveyId
            question
            answers {
                answer
                image
                count
                percent
                isCurrentAccountAnswer
            }
            date
          }
        }
    `
    test('Should return SurveyResult', async () => {
      const survey = await mockSurvey()
      const accessToken = await mockAccessToken()
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: survey.id.toString()
        }
      })
      expect(res.data.surveyResult.surveyId).toBeTruthy()
      expect(res.data.surveyResult.question).toBe(survey.question)
      expect(res.data.surveyResult.answers).toEqual([{
        answer: survey.answers[0].answer,
        image: survey.answers[0]?.image,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
      expect(res.data.surveyResult.date).toBe(survey.date.toISOString())
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const survey = await mockSurvey()
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: survey.id.toString()
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('AccessDeniedError: Access Denied.')
    })
  })
})
