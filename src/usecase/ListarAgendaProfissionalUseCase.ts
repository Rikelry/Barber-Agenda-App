// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { IListarAgendaProfissionalUseCase } from './IListarAgendaProfissionalUseCase'
import { Agendamento } from '../model/entities/Agendamento'

export class ListarAgendaProfissionalUseCase implements IListarAgendaProfissionalUseCase {
  constructor(private readonly agendamentoRepository: IAgendamentoRepository) {}

  async executar(professionalId: string): Promise<Agendamento[]> {
    return this.agendamentoRepository.listarPorProfissional(professionalId)
  }
}
