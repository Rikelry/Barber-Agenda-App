// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IIndisponibilidadeRepository } from '../model/datasources/IIndisponibilidadeRepository'
import { IListarIndisponibilidadesUseCase } from './IListarIndisponibilidadesUseCase'
import { Indisponibilidade } from '../model/entities/Indisponibilidade'

/** Lista as indisponibilidades registradas de um profissional (para exibir/remover). */
export class ListarIndisponibilidadesUseCase implements IListarIndisponibilidadesUseCase {
  constructor(private readonly indisponibilidadeRepository: IIndisponibilidadeRepository) {}

  async executar(professionalId: string): Promise<Indisponibilidade[]> {
    return this.indisponibilidadeRepository.listarPorProfissional(professionalId)
  }
}
