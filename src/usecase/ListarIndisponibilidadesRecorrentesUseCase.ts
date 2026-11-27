// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IIndisponibilidadeRecorrenteRepository } from '../model/datasources/IIndisponibilidadeRecorrenteRepository'
import { IListarIndisponibilidadesRecorrentesUseCase } from './IListarIndisponibilidadesRecorrentesUseCase'
import { IndisponibilidadeRecorrente } from '../model/entities/IndisponibilidadeRecorrente'

/** Lista as indisponibilidades recorrentes registradas de um profissional (para exibir/remover). */
export class ListarIndisponibilidadesRecorrentesUseCase implements IListarIndisponibilidadesRecorrentesUseCase {
  constructor(private readonly indisponibilidadeRecorrenteRepository: IIndisponibilidadeRecorrenteRepository) {}

  async executar(professionalId: string): Promise<IndisponibilidadeRecorrente[]> {
    return this.indisponibilidadeRecorrenteRepository.listarPorProfissional(professionalId)
  }
}
