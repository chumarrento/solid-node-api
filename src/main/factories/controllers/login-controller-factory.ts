import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers'
import { makeDbAuthentication, makeLogControllerDecorator, makeLoginValidation } from '@/main/factories'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
