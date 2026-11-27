// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface Indisponibilidade {
  id: string
  professionalId: string
  startsAt: string
  endsAt: string
  reason: string | null
  createdAt: string
}
