// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Router } from 'express'
import { AgendamentoController } from '../controllers/AgendamentoController'
import { autenticar, autorizar } from '../middlewares/autenticar'
import { validate } from '../middlewares/validate'
import { criarAgendamentoSchema, reagendarAgendamentoSchema } from '../schemas/AgendamentoSchema'

export function routerAgendamento(controller: AgendamentoController) {
  const router = Router()

  // RF010 — Consulta de agendamentos (cliente)
  router.get('/', autenticar, (req, res, next) =>
    controller.listarMeusAgendamentos(req, res, next)
  )

  // RF011 — Consulta de agenda (profissional)
  router.get('/minha-agenda', autenticar, autorizar('profissional'), (req, res, next) =>
    controller.listarMinhaAgenda(req, res, next)
  )

  // Agenda da barbearia (owner)
  router.get('/barbearia/:barbershopId', autenticar, (req, res, next) =>
    controller.listarAgendaBarbearia(req, res, next)
  )

  // Pedido de horário: aprovar ou recusar (profissional do agendamento ou owner)
  router.patch('/:id/aprovar', autenticar, controller.responder('aprovar'))
  router.patch('/:id/recusar', autenticar, controller.responder('recusar'))

  // Atendimento: iniciar e não compareceu (profissional do agendamento ou owner)
  router.patch('/:id/iniciar', autenticar, controller.mudar('iniciar'))
  router.patch('/:id/nao-compareceu', autenticar, controller.mudar('nao_compareceu'))

  // Sugestão de outro horário: o profissional sugere, o cliente aceita ou recusa
  router.patch('/:id/sugerir', autenticar, validate(reagendarAgendamentoSchema), (req, res, next) =>
    controller.sugerir(req, res, next)
  )
  router.patch('/:id/aceitar-sugestao', autenticar, controller.responderSugestao('aceitar'))
  router.patch('/:id/recusar-sugestao', autenticar, controller.responderSugestao('recusar'))

  // RF006, RF007 — Cria agendamento (só cliente pode agendar, ADR-007)
  router.post('/', autenticar, autorizar('cliente'), validate(criarAgendamentoSchema), (req, res, next) =>
    controller.criar(req, res, next)
  )

  // RF008 — Cancelamento
  router.patch('/:id/cancelar', autenticar, (req, res, next) =>
    controller.cancelar(req, res, next)
  )

  // RF029 — Conclusão
  router.patch('/:id/concluir', autenticar, (req, res, next) =>
    controller.concluir(req, res, next)
  )

  // RF009 — Reagendamento
  router.patch('/:id/reschedule', autenticar, validate(reagendarAgendamentoSchema), (req, res, next) =>
    controller.reagendar(req, res, next)
  )

  return router
}
