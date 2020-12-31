import { MongoHelper } from '@/infra/db'
import { makeApolloServer } from './helpers'

import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { ApolloServer, gql } from 'apollo-server-express'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
        query login ($email: String!, $password: String!) {
            login (email: $email, password: $password) {
                accessToken
                name
            }
        }
    `

    test('Should return an Account on valid credentials', async () => {
      const password = await hash('secret', 12)
      await accountCollection.insertOne({
        name: 'Test Name',
        email: 'test_email@email.com',
        password
      })
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: 'test_email@email.com',
          password: 'secret'
        }
      })
      expect(res.data.login.accessToken).toBeTruthy()
      expect(res.data.login.name).toBe('Test Name')
    })
  })
})
