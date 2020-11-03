import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import Mockdate from 'mockdate'
import { mockSurveyModel } from '@/domain/test'
import { mockLoadSurveyByIdRepository } from '@/data/test'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryIdStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryIdStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryIdStub)
  return {
    sut,
    loadSurveyByIdRepositoryIdStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryIdStub, 'loadById')
    const survey = mockSurveyModel()
    await sut.loadById(survey.id)
    expect(loadByIdSpy).toHaveBeenCalledWith(survey.id)
  })

  test('Should return Survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(mockSurveyModel())
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
