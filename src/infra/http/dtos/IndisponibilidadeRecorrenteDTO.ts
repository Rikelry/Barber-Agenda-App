// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface RegistrarIndisponibilidadeRecorrenteDTO {
  barbershopId: string
  professionalId: string
  requesterId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  reason?: string
}

export interface RemoverIndisponibilidadeRecorrenteDTO {
  barbershopId: string
  professionalId: string
  recurringUnavailabilityId: string
  requesterId: string
}
