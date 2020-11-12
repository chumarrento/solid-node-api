import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test'
import { LoadSurveyById, HttpRequest, LoadSurveyResult } from './load-survey-result-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

const mockHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockHttpRequest())
    expect(loadSurveyByIdSpy).toHaveBeenLastCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSurveyResultSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockHttpRequest())
    expect(loadSurveyResultSpy).toHaveBeenLastCalledWith('any_survey_id')
  })
})
