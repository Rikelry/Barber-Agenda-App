// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { AppError } from '../infra/errors/AppError'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'

export type DecisaoSolicitacao = 'aprovar' | 'recusar'

export interface IResponderSolicitacaoUseCase {
  executar(agendamentoId: string, decisao: DecisaoSolicitacao, userId: string, motivo?: string): Promise<void>
}

/**
 * Aprova ou recusa um pedido de horário (status 'pendente').
 * Quem pode responder: o profissional do agendamento ou o owner da barbearia — checado pela
 * relação real, mesmo padrão de ConcluirAgendamentoUseCase. Aprovar vira 'agendado'; recusar
 * vira 'recusado' e libera o horário.
 */
export class ResponderSolicitacaoUseCase implements IResponderSolicitacaoUseCase {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(agendamentoId: string, decisao: DecisaoSolicitacao, userId: string, motivo?: string): Promise<void> {
    const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId)

    if (!agendamento) {
      throw new AppError('Agendamento não encontrado.', 404, 'APPOINTMENT_NOT_FOUND')
    }

    const profissional = await this.profissionalRepository.buscarPorIdGlobal(agendamento.professionalId)
    let autorizado = profissional?.userId === userId

    if (!autorizado) {
      const barbearia = await this.barbeariaRepository.buscarPorId(agendamento.barbershopId)
      autorizado = barbearia?.ownerId === userId
    }

    if (!autorizado) {
      throw new AppError('Não autorizado para responder esta solicitação.', 403, 'UNAUTHORIZED')
    }

    if (agendamento.status !== 'pendente') {
      throw new AppError('Esta solicitação já foi respondida.', 400, 'INVALID_STATUS')
    }

    const texto = motivo?.trim().slice(0, 200) || null
    await this.agendamentoRepository.atualizar(
      agendamentoId,
      decisao === 'aprovar' ? { status: 'agendado' } : { status: 'recusado', rejectionReason: texto },
    )
  }
}
