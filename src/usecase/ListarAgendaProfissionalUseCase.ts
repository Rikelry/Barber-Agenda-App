// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { IListarAgendaProfissionalUseCase } from './IListarAgendaProfissionalUseCase'
import { AgendaItemDTO } from '../infra/http/dtos/AgendamentoDTO'
import { MontarItensDeAgenda } from './MontarItensDeAgenda'

export class ListarAgendaProfissionalUseCase implements IListarAgendaProfissionalUseCase {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly montarItens: MontarItensDeAgenda
  ) {}

  async executar(professionalId: string): Promise<AgendaItemDTO[]> {
    return this.montarItens.executar(await this.agendamentoRepository.listarPorProfissional(professionalId))
  }
}
