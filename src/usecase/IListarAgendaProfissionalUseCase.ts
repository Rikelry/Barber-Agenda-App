// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { AgendaItemDTO } from '../infra/http/dtos/AgendamentoDTO'

export interface IListarAgendaProfissionalUseCase {
  executar(professionalId: string): Promise<AgendaItemDTO[]>
}
