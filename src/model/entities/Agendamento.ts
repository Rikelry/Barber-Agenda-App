// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
/**
 * pendente: o cliente pediu e aguarda o profissional ou o dono (já reserva o horário).
 * aguardando_cliente: o profissional sugeriu outro horário; o cliente aceita ou recusa.
 * agendado: aprovado. em_andamento: o atendimento começou. concluido: terminou.
 * recusado, cancelado, nao_compareceu: encerrados, liberam o horário.
 */
export type StatusAgendamento =
  | 'pendente'
  | 'aguardando_cliente'
  | 'agendado'
  | 'em_andamento'
  | 'concluido'
  | 'recusado'
  | 'cancelado'
  | 'nao_compareceu'

/** Status que ocupam o horário do profissional. */
export const STATUS_ATIVOS: StatusAgendamento[] = ['pendente', 'aguardando_cliente', 'agendado', 'em_andamento']

/** Horário sugerido em formato de resposta (HH:mm), ou null. */
export function propostaDe(a: Pick<Agendamento, 'status' | 'proposedDate' | 'proposedStartTime' | 'proposedEndTime'>) {
  if (a.status !== 'aguardando_cliente' || !a.proposedDate || !a.proposedStartTime || !a.proposedEndTime) return null
  return { date: a.proposedDate, startTime: a.proposedStartTime.slice(0, 5), endTime: a.proposedEndTime.slice(0, 5) }
}

export interface Agendamento {
  id: string
  clientId: string
  professionalId: string
  serviceId: string
  barbershopId: string
  date: string
  startTime: string
  endTime: string
  status: StatusAgendamento
  /** Motivo informado ao recusar (opcional). */
  rejectionReason?: string | null
  /** Horário sugerido pelo profissional (status aguardando_cliente). */
  proposedDate?: string | null
  proposedStartTime?: string | null
  proposedEndTime?: string | null
  createdAt: string
  updatedAt: string
}

