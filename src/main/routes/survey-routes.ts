import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories/controllers'
import { authAdminMiddleware, auth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/surveys', authAdminMiddleware, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
