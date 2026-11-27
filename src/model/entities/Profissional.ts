// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface Profissional {
  id: string
  userId: string
  barbershopId: string
  specialty: string | null
  avatarUrl?: string | null
  createdAt: string
}

/**
 * RF004 — dados exibidos na listagem de profissionais da barbearia.
 */
export interface ProfissionalPublico {
  id: string
  barbershopId: string
  specialty: string | null
  avatarUrl?: string | null
  createdAt: string
  name: string
  email: string
  phone: string
}
