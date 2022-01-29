import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import { authDirectiveTransformer } from '@/main/graphql/directives'

import { ApolloServer } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

type GraqphQLErrorsTypes = {
  name: string
  status: number
}

const httpErrors: GraqphQLErrorsTypes[] = [
  {
    name: 'UserInputError',
    status: 400
  },
  {
    name: 'AuthenticationError',
    status: 401
  },
  {
    name: 'ForbiddenError',
    status: 403
  },
  {
    name: 'ApolloError',
    status: 500
  }
]

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    httpErrors.forEach(httpError => {
      if (checkError(error, httpError.name)) {
        response.http.status = httpError.status
      }
    })
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransformer(schema)

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  plugins: [{
    requestDidStart: async () => ({
      willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
    })
  }]
})
// server.applyMiddleware({ app })
