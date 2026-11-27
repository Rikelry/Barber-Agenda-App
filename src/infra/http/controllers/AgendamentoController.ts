// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Request, Response, NextFunction } from 'express'
import { IListarAgendaProfissionalUseCase } from '../../../usecase/IListarAgendaProfissionalUseCase'
import { ICriarAgendamentoUseCase } from '../../../usecase/ICriarAgendamentoUseCase'
import { ICancelarAgendamentoUseCase } from '../../../usecase/ICancelarAgendamentoUseCase'
import { IConcluirAgendamentoUseCase } from '../../../usecase/ConcluirAgendamentoUseCase'
import { IReagendarAgendamentoUseCase } from '../../../usecase/IReagendarAgendamentoUseCase'
import { ListarAgendamentosClienteUseCase } from '../../../usecase/ListarAgendamentosClienteUseCase'
import { IProfissionalRepository } from '../../../model/datasources/IProfissionalRepository'
import { AppError } from '../../errors/AppError'
import { DecisaoSolicitacao, IResponderSolicitacaoUseCase } from '../../../usecase/ResponderSolicitacaoUseCase'
import { IListarAgendaBarbeariaUseCase } from '../../../usecase/ListarAgendaBarbeariaUseCase'
import { IMudarAtendimentoUseCase, MudancaAtendimento } from '../../../usecase/MudarAtendimentoUseCase'
import { ISugerirHorarioUseCase } from '../../../usecase/SugerirHorarioUseCase'
import { IResponderSugestaoUseCase, RespostaSugestao } from '../../../usecase/ResponderSugestaoUseCase'

export class AgendamentoController {
  constructor(
    private readonly listarAgendaProfissionalUseCase: IListarAgendaProfissionalUseCase,
    private readonly listarAgendamentosClienteUseCase: ListarAgendamentosClienteUseCase,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly criarAgendamentoUseCase: ICriarAgendamentoUseCase,
    private readonly cancelarAgendamentoUseCase: ICancelarAgendamentoUseCase,
    private readonly concluirAgendamentoUseCase: IConcluirAgendamentoUseCase,
    private readonly reagendarAgendamentoUseCase: IReagendarAgendamentoUseCase,
    private readonly responderSolicitacaoUseCase: IResponderSolicitacaoUseCase,
    private readonly listarAgendaBarbeariaUseCase: IListarAgendaBarbeariaUseCase,
    private readonly mudarAtendimentoUseCase: IMudarAtendimentoUseCase,
    private readonly sugerirHorarioUseCase: ISugerirHorarioUseCase,
    private readonly responderSugestaoUseCase: IResponderSugestaoUseCase
  ) {}

  // Iniciar atendimento / não compareceu (profissional do agendamento ou owner)
  mudar(mudanca: MudancaAtendimento) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.usuario) {
          throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
        }
        await this.mudarAtendimentoUseCase.executar(req.params.id as string, mudanca, req.usuario.id)
        return res.status(204).send()
      } catch (err) {
        next(err)
      }
    }
  }

  // Sugerir outro horário para um pedido pendente (profissional do agendamento ou owner)
  async sugerir(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }
      const { date, time } = req.body
      await this.sugerirHorarioUseCase.executar(req.params.id as string, date, time, req.usuario.id)
      return res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  // O cliente aceita ou recusa o horário sugerido
  responderSugestao(resposta: RespostaSugestao) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.usuario) {
          throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
        }
        await this.responderSugestaoUseCase.executar(req.params.id as string, resposta, req.usuario.id)
        return res.status(204).send()
      } catch (err) {
        next(err)
      }
    }
  }

  // Agenda da barbearia (owner): pedidos pendentes e horários de todos os profissionais
  async listarAgendaBarbearia(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }
      const agendamentos = await this.listarAgendaBarbeariaUseCase.executar(
        req.params.barbershopId as string,
        req.usuario.id
      )
      return res.status(200).json({ agendamentos })
    } catch (err) {
      next(err)
    }
  }

  // Aprova ou recusa um pedido de horário (profissional do agendamento ou owner)
  responder(decisao: DecisaoSolicitacao) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.usuario) {
          throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
        }
        const motivo = typeof req.body?.motivo === 'string' ? req.body.motivo : undefined
        await this.responderSolicitacaoUseCase.executar(req.params.id as string, decisao, req.usuario.id, motivo)
        return res.status(204).send()
      } catch (err) {
        next(err)
      }
    }
  }

  // RF011 — Consulta de agenda (profissional)
  async listarMinhaAgenda(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }
      if (!req.usuario.roles.includes('profissional')) {
        throw new AppError('Acesso não autorizado.', 403, 'FORBIDDEN')
      }

      // Todos os vínculos do usuário (ele pode atender em várias barbearias); só os dele.
      const vinculos = await this.profissionalRepository.listarPorUserId(req.usuario.id)
      if (vinculos.length === 0) {
        throw new AppError('Profissional não encontrado para este usuário.', 404, 'PROFESSIONAL_NOT_FOUND')
      }
      const barbershopId = typeof req.query.barbershopId === 'string' ? req.query.barbershopId : undefined
      const escolhidos = barbershopId ? vinculos.filter((v) => v.barbershopId === barbershopId) : vinculos

      const listas = await Promise.all(escolhidos.map((v) => this.listarAgendaProfissionalUseCase.executar(v.id)))
      return res.status(200).json({ agendamentos: listas.flat() })
    } catch (err) {
      next(err)
    }
  }

  // RF010 — Consulta de agendamentos (cliente)
  async listarMeusAgendamentos(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const agendamentos = await this.listarAgendamentosClienteUseCase.executar(req.usuario.id)
      return res.status(200).json({ agendamentos })
    } catch (err) {
      next(err)
    }
  }

  // RF006, RF007 — Cria agendamento com validação de conflito
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const { professionalId, serviceId, date, time } = req.body

      const agendamento = await this.criarAgendamentoUseCase.executar({
        clientId: req.usuario.id,
        professionalId,
        serviceId,
        date,
        time,
      })

      return res.status(201).json(agendamento)
    } catch (err) {
      next(err)
    }
  }

  // RF008 — Cancelamento
  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const id = req.params.id as string

      await this.cancelarAgendamentoUseCase.executar(id, req.usuario.id)

      return res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  // RF029 — Conclusão
  async concluir(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const id = req.params.id as string

      await this.concluirAgendamentoUseCase.executar(id, req.usuario.id)

      return res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  // RF009 — Reagendamento
  async reagendar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const id = req.params.id as string
      const { date, time } = req.body

      const agendamento = await this.reagendarAgendamentoUseCase.executar(
        id,
        { date, time },
        req.usuario.id
      )

      return res.status(200).json(agendamento)
    } catch (err) {
      next(err)
    }
  }
}
