import { apiKeyAuthSchema } from './schemas/'
import {
  serverError,
  badRequest,
  unauthorized,
  notFound,
  forbidden
} from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError
}
