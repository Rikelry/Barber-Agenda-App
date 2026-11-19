import { ReagendarAgendamentoDTO, AgendamentoResponseDTO } from '../../adapters/dtos/AgendamentoDTO'

export interface IReagendarAgendamentoUseCase {
  executar(id: string, dados: ReagendarAgendamentoDTO, userId: string): Promise<AgendamentoResponseDTO>
}
