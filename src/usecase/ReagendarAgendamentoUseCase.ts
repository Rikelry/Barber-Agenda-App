// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { IReagendarAgendamentoUseCase } from './IReagendarAgendamentoUseCase'
import { ReagendarAgendamentoDTO, AgendamentoResponseDTO } from '../infra/http/dtos/AgendamentoDTO'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IServicoRepository } from '../model/datasources/IServicoRepository'
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'
import { IBusinessHoursRepository } from '../model/datasources/IBusinessHoursRepository'
import { IVerificarBloqueioUseCase } from './IVerificarBloqueioUseCase'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'
import { somarMinutos, dataNoPassado, diaDaSemana } from '../infra/utils/dateUtils'

/**
 * RF009 — Reagendamento.
 * Quem pode reagendar: o cliente dono do agendamento, o profissional vinculado
 * a ele ou o owner da barbearia — a mesma regra do cancelamento (RF008).
 */
export class ReagendarAgendamentoUseCase implements IReagendarAgendamentoUseCase {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly servicoRepository: IServicoRepository,
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly businessHoursRepository: IBusinessHoursRepository,
    private readonly verificarBloqueioUseCase: IVerificarBloqueioUseCase,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(id: string, dados: ReagendarAgendamentoDTO, userId: string): Promise<AgendamentoResponseDTO> {
    const agendamento = await this.agendamentoRepository.buscarPorId(id)

    if (!agendamento) {
      throw new AppError('Agendamento não encontrado.', 404, 'APPOINTMENT_NOT_FOUND')
    }

    let autorizado = agendamento.clientId === userId

    if (!autorizado) {
      const vinculado = await this.profissionalRepository.buscarPorIdGlobal(agendamento.professionalId)
      autorizado = vinculado?.userId === userId
    }

    if (!autorizado) {
      const barbearia = await this.barbeariaRepository.buscarPorId(agendamento.barbershopId)
      autorizado = barbearia?.ownerId === userId
    }

    if (!autorizado) {
      throw new AppError('Não autorizado para reagendar este agendamento.', 403, 'UNAUTHORIZED')
    }

    if (agendamento.status !== 'pendente' && agendamento.status !== 'agendado') {
        throw new AppError('Só é possível reagendar um agendamento pendente ou aprovado.', 400, 'INVALID_STATUS')
    }

    if (dataNoPassado(dados.date)) {
      throw new AppError('Data ou horário inválido.', 400, 'INVALID_DATE')
    }

    const profissional = await this.profissionalRepository.buscarPorIdGlobal(agendamento.professionalId)

    if (!profissional) {
      throw new AppError('Profissional não encontrado.', 404, 'PROFESSIONAL_NOT_FOUND')
    }

    const servico = await this.servicoRepository.buscarPorId(agendamento.serviceId, profissional.barbershopId)

    if (!servico) {
      throw new AppError('Serviço não encontrado.', 404, 'SERVICE_NOT_FOUND')
    }

    const endTime = somarMinutos(dados.time, servico.durationMinutes)

    // 1. Horário de funcionamento (RF020)
    const horarios = await this.businessHoursRepository.listarPorBarbeariaId(profissional.barbershopId)
    const horarioDoDia = horarios.find((h) => h.dayOfWeek === diaDaSemana(dados.date))

    const dentroDoHorario =
      horarioDoDia &&
      dados.time >= horarioDoDia.openTime.slice(0, 5) &&
      endTime <= horarioDoDia.closeTime.slice(0, 5)

    if (!dentroDoHorario) {
      throw new AppError('Horário indisponível para este profissional.', 409, 'SCHEDULE_CONFLICT')
    }

    // 2. Conflito com outro agendamento ativo (excluindo o próprio agendamento)
    const temConflitoDeAgendamento = await this.agendamentoRepository.existeConflito(
      agendamento.professionalId,
      dados.date,
      dados.time,
      endTime,
      id
    )

    if (temConflitoDeAgendamento) {
      throw new AppError('Horário indisponível para este profissional.', 409, 'SCHEDULE_CONFLICT')
    }

    // 3. Indisponibilidade registrada do profissional (RF025)
    const estaIndisponivel = await this.verificarBloqueioUseCase.executar(
      agendamento.professionalId,
      `${dados.date}T${dados.time}:00.000Z`,
      `${dados.date}T${endTime}:00.000Z`
    )

    if (estaIndisponivel) {
      throw new AppError('Profissional indisponível neste período.', 409, 'PROFESSIONAL_UNAVAILABLE')
    }

    const agendamentoAtualizado = await this.agendamentoRepository.atualizar(id, {
      date: dados.date,
      startTime: dados.time,
      endTime,
    })

    const usuarioProfissional = await this.usuarioRepository.buscarPorId(profissional.userId)

    return {
      id: agendamentoAtualizado.id,
      barbershopId: agendamentoAtualizado.barbershopId,
      status: agendamentoAtualizado.status,
      professional: { id: profissional.id, name: usuarioProfissional?.name ?? '' },
      service: { id: servico.id, name: servico.name, duration: servico.durationMinutes },
      date: agendamentoAtualizado.date,
      startTime: agendamentoAtualizado.startTime.slice(0, 5),
      endTime: agendamentoAtualizado.endTime.slice(0, 5),
      createdAt: agendamentoAtualizado.createdAt,
    }
  }
}
