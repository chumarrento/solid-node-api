import { adaptMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories/middlewares'

export const authAdminMiddleware = adaptMiddleware(makeAuthMiddleware('admin'))
