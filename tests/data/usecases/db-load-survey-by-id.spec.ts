import { DbLoadSurveyById } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'

import Mockdate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryIdSpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryIdSpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryIdSpy)
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
    await sut.loadById(surveyId)
    expect(loadSurveyByIdRepositoryIdSpy.id).toBe(surveyId)
  })

  test('Should return Survey on success', async () => {
    const { sut, loadSurveyByIdRepositoryIdSpy } = makeSut()
    const survey = await sut.loadById(surveyId)
    expect(survey).toEqual(loadSurveyByIdRepositoryIdSpy.result)
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryIdSpy, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.loadById(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
