import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import schemaDirectives from '@/main/graphql/directives'

import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { GraphQLError } from 'graphql'

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

export default (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives,
    context: ({ req }) => ({ req }),
    plugins: [{
      requestDidStart: () => ({
        willSendResponse: ({ response, errors }) => handleErrors(response, errors)
      })
    }]
  })
  server.applyMiddleware({ app })
}
