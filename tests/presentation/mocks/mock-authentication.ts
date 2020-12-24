import { AuthenticationModel } from '@/domain/models/authentication'
import { Authentication, AuthenticationParams } from '@/domain/usecases/authentication'
import faker from 'faker'

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel = {
    accessToken: faker.random.uuid(),
    name: faker.name.findName()
  }

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authentication
    return Promise.resolve(this.authenticationModel)
  }
}
