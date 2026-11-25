// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IIndisponibilidadeRepository } from '../model/datasources/IIndisponibilidadeRepository'
import { IRegistrarIndisponibilidadeUseCase } from './IRegistrarIndisponibilidadeUseCase'
import { RegistrarIndisponibilidadeDTO } from '../infra/http/dtos/IndisponibilidadeDTO'
import { Indisponibilidade } from '../model/entities/Indisponibilidade'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { IBusinessHoursRepository } from '../model/datasources/IBusinessHoursRepository'
import { AppError } from '../infra/errors/AppError'
import { diaDaSemana } from '../infra/utils/dateUtils'

/**
 * RF024 — Registra indisponibilidade.
 * Só o próprio profissional ou o owner da barbearia podem registrar
 * (barbeiros.md, ADR-007).
 */
export class RegistrarIndisponibilidadeUseCase implements IRegistrarIndisponibilidadeUseCase {
  constructor(
    private readonly indisponibilidadeRepository: IIndisponibilidadeRepository,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly barbeariaRepository: IBarbeariaRepository,
    private readonly businessHoursRepository: IBusinessHoursRepository
  ) {}

  async executar(dados: RegistrarIndisponibilidadeDTO): Promise<Indisponibilidade> {
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
      const dia = diaDaSemana(dados.startsAt.slice(0, 10))
      const horarioDoDia = horarios.find((h) => h.dayOfWeek === dia)
      if (!horarioDoDia) {
        throw new AppError(
          'A barbearia não abre nesta data. Não é necessário cadastrar indisponibilidade.',
          400,
          'BARBERSHOP_CLOSED_ON_DAY'
        )
      }
    }

    return this.indisponibilidadeRepository.criar({
      professionalId: dados.professionalId,
      startsAt: dados.startsAt,
      endsAt: dados.endsAt,
      reason: dados.reason ?? null,
    })
  }
}
