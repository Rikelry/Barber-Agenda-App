// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Router } from 'express'
import { ProfissionalController } from '../controllers/ProfissionalController'
import { autenticar } from '../middlewares/autenticar'

/**
 * Monta-se em app.use('/professionals', routerProfissionalMe(controller)).
 * Rota top-level (fora de /barbershops/:barbershopId) porque o cliente
 * ainda não sabe o barbershopId — é justamente o que ela descobre.
 */
export function routerProfissionalMe(controller: ProfissionalController) {
  const router = Router()

  router.get('/me', autenticar, (req, res, next) => controller.buscarMeuProfissional(req, res, next))
  router.get('/me/vinculos', autenticar, (req, res, next) => controller.listarMeusVinculos(req, res, next))

  return router
}
