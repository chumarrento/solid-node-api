import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryIdStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryIdStub = makeLoadSurveyByIdRepositoryIdStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryIdStub)
  return {
    sut,
    loadSurveyByIdRepositoryIdStub
  }
}

const makeLoadSurveyByIdRepositoryIdStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer'
  },{
    image: 'any_image',
    answer: 'other_answer'
  }],
  date: new Date()
})

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
    const survey = makeFakeSurvey()
    await sut.loadById(survey.id)
    expect(loadByIdSpy).toHaveBeenCalledWith(survey.id)
  })
})
