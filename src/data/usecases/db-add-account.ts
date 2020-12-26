import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const hasAccount = await this.loadByEmailRepository.loadByEmail(accountData.email)
    let account: AccountModel = null
    if (!hasAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return account != null
  }
}
