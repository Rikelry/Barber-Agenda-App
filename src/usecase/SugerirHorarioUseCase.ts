// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { AppError } from '../infra/errors/AppError'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { IServicoRepository } from '../model/datasources/IServicoRepository'
import { IBusinessHoursRepository } from '../model/datasources/IBusinessHoursRepository'
import { IVerificarBloqueioUseCase } from './IVerificarBloqueioUseCase'

export interface ISugerirHorarioUseCase {
  executar(agendamentoId: string, date: string, time: string, userId: string): Promise<void>
}

const somarMinutos = (hora: string, minutos: number) => {
  const [h, m] = hora.split(':').map(Number)
  const total = (h ?? 0) * 60 + (m ?? 0) + minutos
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const diaDaSemana = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay()

/**
 * O profissional (ou o owner) sugere outro horário para um pedido pendente: o pedido passa a
 * aguardando_cliente com o horário sugerido reservado, e o cliente aceita ou recusa. Valida
 * funcionamento, conflitos e bloqueios como o reagendamento.
 */
export class SugerirHorarioUseCase implements ISugerirHorarioUseCase {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly barbeariaRepository: IBarbeariaRepository,
    private readonly servicoRepository: IServicoRepository,
    private readonly businessHoursRepository: IBusinessHoursRepository,
    private readonly verificarBloqueioUseCase: IVerificarBloqueioUseCase
  ) {}

  async executar(agendamentoId: string, date: string, time: string, userId: string): Promise<void> {
    const agendamento = await this.agendamentoRepository.buscarPorId(agendamentoId)
    if (!agendamento) {
      throw new AppError('Agendamento não encontrado.', 404, 'APPOINTMENT_NOT_FOUND')
    }

    const profissional = await this.profissionalRepository.buscarPorIdGlobal(agendamento.professionalId)
    let autorizado = profissional?.userId === userId
    if (!autorizado) {
      const barbearia = await this.barbeariaRepository.buscarPorId(agendamento.barbershopId)
      autorizado = barbearia?.ownerId === userId
    }
    if (!autorizado) {
      throw new AppError('Não autorizado para sugerir horário neste pedido.', 403, 'UNAUTHORIZED')
    }
    if (agendamento.status !== 'pendente') {
      throw new AppError('Só é possível sugerir outro horário para um pedido pendente.', 400, 'INVALID_STATUS')
    }

    const servico = await this.servicoRepository.buscarPorId(agendamento.serviceId, agendamento.barbershopId)
    if (!servico) {
      throw new AppError('Serviço não encontrado.', 404, 'SERVICE_NOT_FOUND')
    }
    const endTime = somarMinutos(time, servico.durationMinutes)

    const horarios = await this.businessHoursRepository.listarPorBarbeariaId(agendamento.barbershopId)
    const doDia = horarios.find((h) => h.dayOfWeek === diaDaSemana(date))
    if (!doDia || time < doDia.openTime.slice(0, 5) || endTime > doDia.closeTime.slice(0, 5)) {
      throw new AppError('Horário fora do funcionamento da barbearia.', 409, 'SCHEDULE_CONFLICT')
    }
    if (await this.agendamentoRepository.existeConflito(agendamento.professionalId, date, time, endTime, agendamentoId)) {
      throw new AppError('Horário indisponível para este profissional.', 409, 'SCHEDULE_CONFLICT')
    }
    if (
      await this.verificarBloqueioUseCase.executar(
        agendamento.professionalId,
        `${date}T${time}:00.000Z`,
        `${date}T${endTime}:00.000Z`
      )
    ) {
      throw new AppError('Profissional indisponível neste período.', 409, 'PROFESSIONAL_UNAVAILABLE')
    }

    await this.agendamentoRepository.atualizar(agendamentoId, {
      status: 'aguardando_cliente',
      proposedDate: date,
      proposedStartTime: time,
      proposedEndTime: endTime,
    })
  }
}
