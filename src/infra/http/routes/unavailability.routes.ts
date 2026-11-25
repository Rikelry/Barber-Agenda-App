// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Router } from 'express'
import { IndisponibilidadeController } from '../controllers/IndisponibilidadeController'
import { validate } from '../middlewares/validate'
import { autenticar } from '../middlewares/autenticar'
import { registrarIndisponibilidadeSchema } from '../schemas/IndisponibilidadeSchema'

/** Monta-se em app.use('/barbershops/:barbershopId/professionals/:professionalId/unavailability', routerIndisponibilidade(controller)) */
export function routerIndisponibilidade(controller: IndisponibilidadeController) {
  const router = Router({ mergeParams: true })

  // Lista indisponibilidades do profissional
  router.get('/', autenticar, (req, res, next) => controller.listar(req, res, next))

  // RF024 — Registra indisponibilidade (profissional próprio ou owner da barbearia)
  router.post('/', autenticar, validate(registrarIndisponibilidadeSchema), (req, res, next) =>
    controller.registrar(req, res, next)
  )

  // RF024 — Remove indisponibilidade
  router.delete('/:uid', autenticar, (req, res, next) => controller.remover(req, res, next))

  return router
}
