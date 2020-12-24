import { noContent, serverError, success } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoadSurveys } from '@/domain/usecases'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = httpRequest.accountId
      const surveys = await this.loadSurveys.load(accountId)
      return surveys.length ? success(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
