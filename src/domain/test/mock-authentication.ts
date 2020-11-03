import { AuthenticationParams } from '@/domain/usecases/account/auth/authentication'

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@email.com',
  password: 'any_password'
})
