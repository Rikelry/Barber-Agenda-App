// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
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

export interface AgendamentoResponseDTO {
  id: string
  barbershopId: string
  status: 'agendado' | 'concluido' | 'cancelado'
  professional: { id: string; name: string }
  service: { id: string; name: string; duration: number }
  date: string
  startTime: string
  endTime: string
  createdAt: string
}
