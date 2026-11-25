// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Agendamento } from '../model/entities/Agendamento'

export interface IListarAgendaProfissionalUseCase {
  executar(professionalId: string): Promise<Agendamento[]>
}
