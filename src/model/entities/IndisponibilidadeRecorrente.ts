// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface IndisponibilidadeRecorrente {
  id: string
  professionalId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  reason: string | null
  createdAt: string
}
