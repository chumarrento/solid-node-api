import { AddSurvey } from '@/domain/usecases/add-survey'
import { mockSurveysList, mockSurveyModel } from '@/tests/domain/mocks'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { CheckSurveyById } from '@/domain/usecases'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveysList = mockSurveysList()
  accountId: string

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return Promise.resolve(this.surveysList)
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  result = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<LoadSurveyById.Result> {
    this.id = id
    return this.result
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true
  id: string

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}
