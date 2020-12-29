import { DbCheckSurveyById } from '@/data/usecases'
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks'

import faker from 'faker'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryIdSpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryIdSpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryIdSpy)
  return {
    sut,
    checkSurveyByIdRepositoryIdSpy
  }
}

let surveyId: string

describe('DbCheckSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid()
  })

  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositoryIdSpy } = makeSut()
    await sut.checkById(surveyId)
    expect(checkSurveyByIdRepositoryIdSpy.id).toBe(surveyId)
  })

  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById(surveyId)
    expect(exists).toBe(true)
  })

  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositoryIdSpy } = makeSut()
    checkSurveyByIdRepositoryIdSpy.result = false
    const exists = await sut.checkById(surveyId)
    expect(exists).toBe(false)
  })

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryIdSpy } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryIdSpy, 'checkById').mockRejectedValueOnce(new Error())
    const promise = sut.checkById(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
