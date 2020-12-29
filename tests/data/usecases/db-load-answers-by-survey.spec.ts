import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks'

import Mockdate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryIdSpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryIdSpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryIdSpy)
  return {
    sut,
    loadAnswersBySurveyRepositoryIdSpy
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
    const { sut, loadAnswersBySurveyRepositoryIdSpy } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyRepositoryIdSpy.id).toBe(surveyId)
  })

  test('Should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositoryIdSpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([
      loadAnswersBySurveyRepositoryIdSpy.result[0],
      loadAnswersBySurveyRepositoryIdSpy.result[1]
    ])
  })

  test('Should return empty array if LoadSurveyByIdRepository returns empty array', async () => {
    const { sut, loadAnswersBySurveyRepositoryIdSpy } = makeSut()
    loadAnswersBySurveyRepositoryIdSpy.result = []
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryIdSpy } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryIdSpy, 'loadAnswers').mockRejectedValueOnce(new Error())
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
