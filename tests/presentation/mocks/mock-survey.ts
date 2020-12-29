import { AddSurvey } from '@/domain/usecases/add-survey'
import { mockSurveysList } from '@/tests/domain/mocks'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { CheckSurveyById, LoadAnswersBySurvey } from '@/domain/usecases'

import faker from 'faker'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  result = mockSurveysList()
  accountId: string

  async load (accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return this.result
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  id: string
  result = [
    faker.random.word(),
    faker.random.word()
  ]

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
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
