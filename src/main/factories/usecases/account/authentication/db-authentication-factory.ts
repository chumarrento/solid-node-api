import env from '../../../../config/env'
import { DbAuthentication } from '../../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../../../infra/criptography/bcrypt-adapter/bcyrpt-adapter'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
