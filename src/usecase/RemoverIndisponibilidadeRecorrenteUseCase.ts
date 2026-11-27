// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IIndisponibilidadeRecorrenteRepository } from '../model/datasources/IIndisponibilidadeRecorrenteRepository'
import { IRemoverIndisponibilidadeRecorrenteUseCase } from './IRemoverIndisponibilidadeRecorrenteUseCase'
import { RemoverIndisponibilidadeRecorrenteDTO } from '../infra/http/dtos/IndisponibilidadeRecorrenteDTO'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'

/** Remove indisponibilidade recorrente — mesma regra de autorização do registro. */
export class RemoverIndisponibilidadeRecorrenteUseCase implements IRemoverIndisponibilidadeRecorrenteUseCase {
  constructor(
    private readonly indisponibilidadeRecorrenteRepository: IIndisponibilidadeRecorrenteRepository,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(dados: RemoverIndisponibilidadeRecorrenteDTO): Promise<void> {
    const profissional = await this.profissionalRepository.buscarCompletoPorId(
      dados.professionalId,
      dados.barbershopId
    )

    if (!profissional) {
      throw new AppError('Profissional não encontrado.', 404, 'PROFESSIONAL_NOT_FOUND')
    }

    const indisponibilidade = await this.indisponibilidadeRecorrenteRepository.buscarPorId(
      dados.recurringUnavailabilityId,
      dados.professionalId
    )

    if (!indisponibilidade) {
      throw new AppError('Indisponibilidade não encontrada.', 404, 'UNAVAILABILITY_NOT_FOUND')
    }

    const ehOProprioProfissional = profissional.userId === dados.requesterId

    if (!ehOProprioProfissional) {
      const barbearia = await this.barbeariaRepository.buscarPorId(dados.barbershopId)
      const ehOwnerDaBarbearia = barbearia?.ownerId === dados.requesterId

      if (!ehOwnerDaBarbearia) {
        throw new AppError('Você não tem permissão para acessar este recurso.', 403, 'FORBIDDEN')
      }
    }

    await this.indisponibilidadeRecorrenteRepository.remover(dados.recurringUnavailabilityId, dados.professionalId)
  }
}
