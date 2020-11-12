import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => Object.assign(mockAddAccountParams(), {
  id: faker.random.uuid()
})
