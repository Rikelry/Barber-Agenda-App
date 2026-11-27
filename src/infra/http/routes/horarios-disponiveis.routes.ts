// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Router } from 'express'
import { HorariosDisponiveisController } from '../controllers/HorariosDisponiveisController'
import { autenticar } from '../middlewares/autenticar'

/**
 * Monta-se em app.use(
 *   '/barbershops/:barbershopId/professionals/:professionalId/available-slots',
 *   routerHorariosDisponiveis(controller)
 * )
 */
export function routerHorariosDisponiveis(controller: HorariosDisponiveisController) {
  const router = Router({ mergeParams: true })

  router.get('/', autenticar, (req, res, next) => controller.listar(req, res, next))

  return router
}
