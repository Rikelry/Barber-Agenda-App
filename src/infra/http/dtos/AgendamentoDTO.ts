// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { StatusAgendamento } from '../../../model/entities/Agendamento'

export interface CriarAgendamentoDTO {
  clientId: string
  professionalId: string
  serviceId: string
  date: string
  time: string
}

export interface ReagendarAgendamentoDTO {
  date: string
  time: string
}

/** Item das agendas do profissional e da barbearia: o agendamento com o nome de quem pediu. */
export interface AgendaItemDTO {
  id: string
  barbershopId: string
  status: AgendamentoResponseDTO['status']
  client: { id: string; name: string; phone: string }
  professional: { id: string; name: string }
  service: { id: string; name: string; duration: number }
  date: string
  startTime: string
  endTime: string
  rejectionReason: string | null
  proposal: PropostaDTO | null
  createdAt: string
}

/** Horário sugerido pelo profissional, aguardando o cliente. */
export interface PropostaDTO {
  date: string
  startTime: string
  endTime: string
}

export interface AgendamentoResponseDTO {
  id: string
  barbershopId: string
  status: StatusAgendamento
  professional: { id: string; name: string }
  service: { id: string; name: string; duration: number }
  date: string
  startTime: string
  endTime: string
  rejectionReason?: string | null
  proposal?: PropostaDTO | null
  createdAt: string
}
