// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IServicoRepository } from '../model/datasources/IServicoRepository'
import { IListarServicosUseCase } from './IListarServicosUseCase'
import { Servico } from '../model/entities/Servico'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'

/**
 * RF015 — Seleção de serviço.
 * Lista os serviços da barbearia para o cliente escolher antes de agendar
 * (servicos.md) — aberta a qualquer usuário autenticado, sem restrição de owner.
 */
export class ListarServicosUseCase implements IListarServicosUseCase {
  constructor(
    private readonly servicoRepository: IServicoRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(barbershopId: string): Promise<Servico[]> {
    const barbearia = await this.barbeariaRepository.buscarPorId(barbershopId)

    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }

    return this.servicoRepository.listarPorBarbershopId(barbershopId)
  }
}
