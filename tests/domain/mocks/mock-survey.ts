import { AddSurvey } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import faker from 'faker'

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [{
    answer: faker.random.word()
  },{
    answer: faker.random.word(),
    image: faker.image.imageUrl()
  }],
  date: faker.date.recent()
})

export const mockSurveyModel = (): SurveyModel => Object.assign(mockAddSurveyParams(), {
  id: faker.datatype.uuid()
})

export const mockSurveysList = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]
