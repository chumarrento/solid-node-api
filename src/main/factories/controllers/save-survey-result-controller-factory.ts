import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator, makeDbSaveSurveyResult, makeDbLoadAnswersBySurvey } from '@/main/factories'
import { SaveSurveyResultController } from '@/presentation/controllers'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
