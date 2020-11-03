import { badRequest, serverError, unauthorized, success } from '@/presentation/helpers/http/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { LoginController } from './login-controller'
import { HttpRequest, Validation, Authentication } from './login-controller-protocols'
import { mockAuthentication } from '@/presentation/test'
import { mockValidation } from '@/validation/test'

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const mockHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockHttpRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 401 if invalid credentials is provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(success({ accessToken: 'any_token' }))
  })

  test('Should call Validator with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
