// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IBuscarProfissionalUseCase } from './IBuscarProfissionalUseCase'
import { ProfissionalPublico } from '../model/entities/Profissional'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'

/**
 * RF026 — Dados do profissional (detalhe).
 * Mesmo nível de acesso do RF004 (qualquer usuário autenticado).
 */
export class BuscarProfissionalUseCase implements IBuscarProfissionalUseCase {
  constructor(
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(barbershopId: string, id: string): Promise<ProfissionalPublico> {
    const barbearia = await this.barbeariaRepository.buscarPorId(barbershopId)

    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }

    const profissional = await this.profissionalRepository.buscarPorId(id, barbershopId)

    if (!profissional) {
      throw new AppError('Profissional não encontrado.', 404, 'PROFESSIONAL_NOT_FOUND')
    }

    return profissional
  }
}
