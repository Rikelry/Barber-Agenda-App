// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IndisponibilidadeRecorrente } from '../model/entities/IndisponibilidadeRecorrente'

export interface IListarIndisponibilidadesRecorrentesUseCase {
  executar(professionalId: string): Promise<IndisponibilidadeRecorrente[]>
}
