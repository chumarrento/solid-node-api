import { LoadAccountByToken, AccessDeniedError, forbidden, HttpResponse, HttpRequest, Middleware } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) {
      return forbidden(new AccessDeniedError())
    }
    await this.loadAccountByToken.load(accessToken)
  }
}
