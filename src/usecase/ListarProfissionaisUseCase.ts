// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IListarProfissionaisUseCase } from './IListarProfissionaisUseCase'
import { ProfissionalPublico } from '../model/entities/Profissional'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'

/**
 * RF004 — Listagem de profissionais da barbearia.
 * Qualquer usuário autenticado pode visualizar (barbeiros.md) — não é
 * restrito ao owner, diferente do cadastro (RF003).
 */
export class ListarProfissionaisUseCase implements IListarProfissionaisUseCase {
  constructor(
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(barbershopId: string): Promise<ProfissionalPublico[]> {
    const barbearia = await this.barbeariaRepository.buscarPorId(barbershopId)

    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }

    return this.profissionalRepository.listarPorBarbershopId(barbershopId)
  }
}
