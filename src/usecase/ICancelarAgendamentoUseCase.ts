// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { AgendamentoResponseDTO } from '../infra/http/dtos/AgendamentoDTO'

export interface ICancelarAgendamentoUseCase {
  executar(agendamentoId: string, userId: string): Promise<void>
}
