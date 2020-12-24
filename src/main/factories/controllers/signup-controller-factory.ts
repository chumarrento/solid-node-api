import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication, makeLogControllerDecorator, makeSignUpValidation, makeDbAddAccount } from '@/main/factories'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
