import { AuthMiddleware } from './auth-middleware'
import { serverError, success, forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { LoadAccountByTokenSpy } from '@/presentation/test'
import { HttpRequest } from '../protocols'
import faker from 'faker'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

const mockHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.random.uuid()
  }
})

const role = faker.random.word()

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct values', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy.accessToken).toBe(httpRequest.headers['x-access-token'])
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.accountModel = null
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut,loadAccountByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(success({ accountId: loadAccountByTokenSpy.accountModel.id }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
