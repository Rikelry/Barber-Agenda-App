// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { CriarAgendamentoDTO, AgendamentoResponseDTO } from '../infra/http/dtos/AgendamentoDTO'

export interface ICriarAgendamentoUseCase {
  executar(dados: CriarAgendamentoDTO): Promise<AgendamentoResponseDTO>
}
