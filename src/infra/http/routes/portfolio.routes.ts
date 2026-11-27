// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Router } from 'express'
import { PortfolioController } from '../controllers/PortfolioController'
import { autenticar } from '../middlewares/autenticar'
import { validate } from '../middlewares/validate'
import { adicionarFotoSchema } from '../schemas/PortfolioSchema'

/**
 * Monta-se em app.use('/portfolio', routerPortfolio(controller)).
 *   GET    /portfolio/featured                      Inspirações do Início
 *   GET    /portfolio/me                            fotos do profissional logado
 *   POST   /portfolio/me                            publicar (só profissional, com consentimento)
 *   DELETE /portfolio/me/:id                        remover a própria foto
 *   GET    /portfolio/professionals/:professionalId fotos de um profissional
 *   GET    /portfolio/barbershops/:barbershopId     fotos da equipe de uma barbearia
 */
export function routerPortfolio(controller: PortfolioController) {
  const router = Router()

  router.get('/featured', autenticar, (req, res, next) => controller.destaques(req, res, next))
  router.get('/me', autenticar, (req, res, next) => controller.meu(req, res, next))
  router.post('/me', autenticar, validate(adicionarFotoSchema), (req, res, next) => controller.publicar(req, res, next))
  router.delete('/me/:id', autenticar, (req, res, next) => controller.excluir(req, res, next))
  router.get('/professionals/:professionalId', autenticar, (req, res, next) => controller.doProfissional(req, res, next))
  router.get('/barbershops/:barbershopId', autenticar, (req, res, next) => controller.daBarbearia(req, res, next))

  return router
}
