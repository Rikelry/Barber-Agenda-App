// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'
import { AgendaItemDTO } from '../infra/http/dtos/AgendamentoDTO'
import { MontarItensDeAgenda } from './MontarItensDeAgenda'

export interface IListarAgendaBarbeariaUseCase {
  executar(barbershopId: string, userId: string): Promise<AgendaItemDTO[]>
}

/** Agenda de todos os profissionais da barbearia, só para o owner dela. */
export class ListarAgendaBarbeariaUseCase implements IListarAgendaBarbeariaUseCase {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly barbeariaRepository: IBarbeariaRepository,
    private readonly montarItens: MontarItensDeAgenda
  ) {}

  async executar(barbershopId: string, userId: string): Promise<AgendaItemDTO[]> {
    const barbearia = await this.barbeariaRepository.buscarPorId(barbershopId)
    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }
    if (barbearia.ownerId !== userId) {
      throw new AppError('Só o dono pode ver a agenda da barbearia.', 403, 'FORBIDDEN')
    }
    return this.montarItens.executar(await this.agendamentoRepository.listarPorBarbearia(barbershopId))
  }
}
