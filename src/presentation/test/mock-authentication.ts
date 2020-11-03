import { Authentication, AuthenticationParams } from '@/domain/usecases/account/auth/authentication'

export const mockAuthentication = (): Authentication => {
  class AutheticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new AutheticationStub()
}
