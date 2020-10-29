import { adaptMiddleware } from '@/main/adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'

export const authAdminMiddleware = adaptMiddleware(makeAuthMiddleware('admin'))
