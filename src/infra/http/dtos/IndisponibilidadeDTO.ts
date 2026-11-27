// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface RegistrarIndisponibilidadeDTO {
  barbershopId: string
  professionalId: string
  requesterId: string
  startsAt: string
  endsAt: string
  reason?: string
}

export interface RemoverIndisponibilidadeDTO {
  barbershopId: string
  professionalId: string
  unavailabilityId: string
  requesterId: string
}
