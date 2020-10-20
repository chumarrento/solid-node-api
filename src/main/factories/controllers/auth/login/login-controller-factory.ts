import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../../../presentation/protocols'
import { LoginController } from '../../../../../presentation/controllers/auth/login/login-controller'
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../../decorators/log/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
