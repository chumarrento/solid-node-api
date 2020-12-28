import { AddAccount } from '@/domain/usecases/add-account'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'

import faker from 'faker'
export class AddAccountSpy implements AddAccount {
  result = true
  addAccountParams: AddAccount.Params

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  result = { id: faker.random.uuid() }
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.result)
  }
}
