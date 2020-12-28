import { Authentication } from '@/domain/usecases/authentication'
import faker from 'faker'

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  authenticationModel = {
    accessToken: faker.random.uuid(),
    name: faker.name.findName()
  }

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authentication
    return Promise.resolve(this.authenticationModel)
  }
}
