// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { ReagendarAgendamentoDTO, AgendamentoResponseDTO } from '../infra/http/dtos/AgendamentoDTO'

export interface IReagendarAgendamentoUseCase {
  executar(id: string, dados: ReagendarAgendamentoDTO, userId: string): Promise<AgendamentoResponseDTO>
}
