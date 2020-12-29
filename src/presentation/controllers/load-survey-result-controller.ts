import { serverError, forbidden, success } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request
      const hasSurvey = await this.checkSurveyById.checkById(surveyId)
      if (!hasSurvey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
      return success(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    accountId: string
    surveyId: string
  }
}
