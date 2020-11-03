import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => Object.assign(mockAddAccountParams(), {
  id: 'any_id'
})
