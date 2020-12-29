import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'

import Mockdate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositoryIdSpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryIdSpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryIdSpy)
  return {
    sut,
    loadSurveyByIdRepositoryIdSpy
  }
}

let surveyId: string

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  beforeEach(() => {
    surveyId = faker.random.uuid()
  })

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryIdSpy } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadSurveyByIdRepositoryIdSpy.id).toBe(surveyId)
  })

  test('Should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositoryIdSpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([
      loadSurveyByIdRepositoryIdSpy.result.answers[0].answer,
      loadSurveyByIdRepositoryIdSpy.result.answers[1].answer
    ])
  })

  test('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryIdSpy } = makeSut()
    loadSurveyByIdRepositoryIdSpy.result = null
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryIdSpy, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
