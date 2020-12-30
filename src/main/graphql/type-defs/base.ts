import { gql } from 'apollo-server-express'

export default gql`
  scalar Datetime
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`
