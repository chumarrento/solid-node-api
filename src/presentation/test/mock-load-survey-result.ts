import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SurveyResultModel } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultStub()
}
