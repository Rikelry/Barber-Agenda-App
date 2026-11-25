// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Indisponibilidade } from '../model/entities/Indisponibilidade'

export interface IListarIndisponibilidadesUseCase {
  executar(professionalId: string): Promise<Indisponibilidade[]>
}
