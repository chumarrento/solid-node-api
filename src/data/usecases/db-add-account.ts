import { AddAccount } from '@/domain/usecases'
import { Hasher, AddAccountRepository, CheckAccountByEmailRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const hasAccount = await this.checkByEmailRepository.checkByEmail(accountData.email)
    let isNewAccount = false
    if (!hasAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      isNewAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return isNewAccount
  }
}
