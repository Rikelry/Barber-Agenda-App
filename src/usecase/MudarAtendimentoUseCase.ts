// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { AppError } from '../infra/errors/AppError'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'

export type MudancaAtendimento = 'iniciar' | 'nao_compareceu'

export interface IMudarAtendimentoUseCase {
  executar(agendamentoId: string, mudanca: MudancaAtendimento, userId: string): Promise<void>
}

/**
 * Iniciar atendimento (agendado → em_andamento) e marcar que o cliente não compareceu
 * (agendado → nao_compareceu). Só o profissional do agendamento ou o owner da barbearia,
 * checado pela relação real como em ConcluirAgendamentoUseCase.
 */
export class MudarAtendimentoUseCase implements IMudarAtendimentoUseCase {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(agendamentoId: string, mudanca: MudancaAtendimento, userId: string): Promise<void> {
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
      throw new AppError('Não autorizado para alterar este atendimento.', 403, 'UNAUTHORIZED')
    }

    if (agendamento.status !== 'agendado') {
      throw new AppError('Só é possível alterar um atendimento confirmado.', 400, 'INVALID_STATUS')
    }

    await this.agendamentoRepository.atualizar(agendamentoId, {
      status: mudanca === 'iniciar' ? 'em_andamento' : 'nao_compareceu',
    })
  }
}
