// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IIndisponibilidadeRecorrenteRepository } from '../model/datasources/IIndisponibilidadeRecorrenteRepository'
import { IRegistrarIndisponibilidadeRecorrenteUseCase } from './IRegistrarIndisponibilidadeRecorrenteUseCase'
import { RegistrarIndisponibilidadeRecorrenteDTO } from '../infra/http/dtos/IndisponibilidadeRecorrenteDTO'
import { IndisponibilidadeRecorrente } from '../model/entities/IndisponibilidadeRecorrente'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { IBusinessHoursRepository } from '../model/datasources/IBusinessHoursRepository'
import { AppError } from '../infra/errors/AppError'

/**
 * Registra indisponibilidade recorrente (repete toda semana no dia
 * informado) — complementa RF024/RF025. Mesma regra de autorização do
 * bloqueio por data específica: só o próprio profissional ou o owner da
 * barbearia podem registrar (barbeiros.md, ADR-007).
 */
export class RegistrarIndisponibilidadeRecorrenteUseCase implements IRegistrarIndisponibilidadeRecorrenteUseCase {
  constructor(
    private readonly indisponibilidadeRecorrenteRepository: IIndisponibilidadeRecorrenteRepository,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly barbeariaRepository: IBarbeariaRepository,
    private readonly businessHoursRepository: IBusinessHoursRepository
  ) {}

  async executar(dados: RegistrarIndisponibilidadeRecorrenteDTO): Promise<IndisponibilidadeRecorrente> {
    const profissional = await this.profissionalRepository.buscarCompletoPorId(
      dados.professionalId,
      dados.barbershopId
    )

    if (!profissional) {
      throw new AppError('Profissional não encontrado.', 404, 'PROFESSIONAL_NOT_FOUND')
    }

    const ehOProprioProfissional = profissional.userId === dados.requesterId

    if (!ehOProprioProfissional) {
      const barbearia = await this.barbeariaRepository.buscarPorId(dados.barbershopId)
      const ehOwnerDaBarbearia = barbearia?.ownerId === dados.requesterId

      if (!ehOwnerDaBarbearia) {
        throw new AppError('Você não tem permissão para acessar este recurso.', 403, 'FORBIDDEN')
      }
    }

    // Valida se a barbearia abre neste dia da semana
    const horarios = await this.businessHoursRepository.listarPorBarbeariaId(dados.barbershopId)
    if (horarios.length > 0) {
      const horarioDoDia = horarios.find((h) => h.dayOfWeek === dados.dayOfWeek)
      if (!horarioDoDia) {
        throw new AppError(
          'A barbearia não abre neste dia da semana. Não é necessário cadastrar indisponibilidade.',
          400,
          'BARBERSHOP_CLOSED_ON_DAY'
        )
      }
    }

    return this.indisponibilidadeRecorrenteRepository.criar({
      professionalId: dados.professionalId,
      dayOfWeek: dados.dayOfWeek,
      startTime: dados.startTime,
      endTime: dados.endTime,
      reason: dados.reason ?? null,
    })
  }
}
