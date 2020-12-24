import { AddSurveyParams } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import faker from 'faker'

export const mockAddSurveyParams = (): AddSurveyParams => ({
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
  id: faker.random.uuid()
})

export const mockSurveysList = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]
