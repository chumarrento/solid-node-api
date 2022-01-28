import { Authentication } from '@/domain/usecases/authentication'
import faker from 'faker'

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.findName()
  }

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authentication
    return this.result
  }
}
