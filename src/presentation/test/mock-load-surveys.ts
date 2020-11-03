import { mockSurveysList } from '@/domain/test'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { SurveyModel } from '@/domain/models/survey'

export const mockLoadSuveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveysList()))
    }
  }

  return new LoadSurveysStub()
}
