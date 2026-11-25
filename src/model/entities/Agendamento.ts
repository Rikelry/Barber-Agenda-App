// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface Agendamento {
  id: string
  clientId: string
  professionalId: string
  serviceId: string
  barbershopId: string
  date: string
  startTime: string
  endTime: string
  status: 'agendado' | 'concluido' | 'cancelado'
  createdAt: string
  updatedAt: string
}

