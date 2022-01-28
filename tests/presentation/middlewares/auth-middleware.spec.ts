import { AuthMiddleware } from '@/presentation/middlewares'
import { serverError, success, forbidden } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks'
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

const mockrequest = (): AuthMiddleware.Request => ({
  accessToken: faker.datatype.uuid()
})

const role = faker.random.word()

describe('Auth Middleware', () => {
  test('Should return 403 if no accessToken exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct values', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const request = mockrequest()
    await sut.handle(request)
    expect(loadAccountByTokenSpy.accessToken).toBe(request.accessToken)
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.result = null
    const httpResponse = await sut.handle(mockrequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut,loadAccountByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockrequest())
    expect(httpResponse).toEqual(success({ accountId: loadAccountByTokenSpy.result.id }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockrequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
