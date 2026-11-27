// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { IBuscarBarbeariaPorIdUseCase } from './IBuscarBarbeariaPorIdUseCase'
import { Barbearia } from '../model/entities/Barbearia'
import { AppError } from '../infra/errors/AppError'

export class BuscarBarbeariaPorIdUseCase implements IBuscarBarbeariaPorIdUseCase {
  constructor(private readonly barbeariaRepository: IBarbeariaRepository) {}

  async executar(id: string): Promise<Barbearia> {
    const barbearia = await this.barbeariaRepository.buscarPorId(id)

    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }

    return barbearia
  }
}
