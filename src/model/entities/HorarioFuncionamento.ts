// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
// src/barbershops/domain/entidades/BusinessHours.ts
export interface BusinessHours {
  id: string
  barbershopId: string
  dayOfWeek: number
  openTime: string
  closeTime: string
}
