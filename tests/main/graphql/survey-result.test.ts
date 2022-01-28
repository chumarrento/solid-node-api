import env from '@/main/config/env'
import request from 'supertest'
import app from '@/main/config/app'

import { MongoHelper } from '@/infra/db'
import { SurveyModel } from '@/domain/models'

import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import Mockdate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Test Name',
    email: 'test_email@email.com',
    password: 'test_password'
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

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })
  const survey = await surveyCollection.findOne({ _id: res.insertedId })
  return MongoHelper.map(survey)
}

describe('Survey Result GraphQL', () => {
  beforeAll(async () => {
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

    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    test('Should return SurveyResult', async () => {
      const survey = await mockSurvey()
      const accessToken = await mockAccessToken()

      const surveyId = survey.id

      const query = `query {
        surveyResult (surveyId: "${surveyId}") {
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
      }`
      const res = await request(app).post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.surveyId).toBeTruthy()
      expect(res.body.data.surveyResult.question).toBe(survey.question)
      expect(res.body.data.surveyResult.answers).toEqual([{
        answer: survey.answers[0].answer,
        image: survey.answers[0]?.image,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
      expect(res.body.data.surveyResult.date).toBe(survey.date.toISOString())
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const survey = await mockSurvey()
      const surveyId = survey.id
      const query = `query {
        surveyResult (surveyId: "${surveyId}") {
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
      }`
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('AccessDeniedError: Access Denied.')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    test('Should return SurveyResult on valid answer', async () => {
      const survey = await mockSurvey()
      const accessToken = await mockAccessToken()

      const surveyId = survey.id
      const query = `mutation {
        saveSurveyResult (surveyId: "${surveyId}", answer: "any_answer") {
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
      }`

      const res = await request(app).post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.surveyId).toBeTruthy()
      expect(res.body.data.saveSurveyResult.question).toBe(survey.question)
      expect(res.body.data.saveSurveyResult.answers).toEqual([{
        answer: survey.answers[0].answer,
        image: survey.answers[0]?.image,
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }])
      expect(res.body.data.saveSurveyResult.date).toBe(survey.date.toISOString())
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const survey = await mockSurvey()

      const surveyId = survey.id
      const query = `mutation {
        saveSurveyResult (surveyId: "${surveyId}", answer: "any_answer") {
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
      }`
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('AccessDeniedError: Access Denied.')
    })
  })
})
