import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountParams } from '@/domain/usecases/add-account'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account
    return Promise.resolve(this.accountModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel()
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.accountModel)
  }
}
