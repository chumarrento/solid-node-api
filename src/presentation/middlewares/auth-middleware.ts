import { success } from '../helpers/http/http-helper'
import { LoadAccountByToken, AccessDeniedError, forbidden, HttpResponse, HttpRequest, Middleware } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) {
        return success({ accountId: account.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
