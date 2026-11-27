// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { AppError } from '../infra/errors/AppError'

export type RespostaSugestao = 'aceitar' | 'recusar'

export interface IResponderSugestaoUseCase {
  executar(agendamentoId: string, resposta: RespostaSugestao, userId: string): Promise<void>
}

/**
 * O cliente responde ao horário sugerido pelo profissional. Aceitar move o agendamento para o
 * horário sugerido e o confirma (agendado); recusar encerra o pedido (cancelado) e libera os
 * dois horários. Só o próprio cliente do agendamento.
 */
export class ResponderSugestaoUseCase implements IResponderSugestaoUseCase {
  constructor(private readonly agendamentoRepository: IAgendamentoRepository) {}

  async executar(agendamentoId: string, resposta: RespostaSugestao, userId: string): Promise<void> {
    const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId)
    if (!agendamento) {
      throw new AppError('Agendamento não encontrado.', 404, 'APPOINTMENT_NOT_FOUND')
    }
    if (agendamento.clientId !== userId) {
      throw new AppError('Só o cliente pode responder a esta sugestão.', 403, 'UNAUTHORIZED')
    }
    if (
      agendamento.status !== 'aguardando_cliente' ||
      !agendamento.proposedDate ||
      !agendamento.proposedStartTime ||
      !agendamento.proposedEndTime
    ) {
      throw new AppError('Não há horário sugerido para responder.', 400, 'INVALID_STATUS')
    }

    const limpar = { proposedDate: null, proposedStartTime: null, proposedEndTime: null }
    await this.agendamentoRepository.atualizar(
      agendamentoId,
      resposta === 'aceitar'
        ? {
            status: 'agendado',
            date: agendamento.proposedDate,
            startTime: agendamento.proposedStartTime,
            endTime: agendamento.proposedEndTime,
            ...limpar,
          }
        : { status: 'cancelado', ...limpar }
    )
  }
}
