// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface TornarSeProfissionalDTO {
  barbershopId: string
  ownerId: string
  specialty?: string
}
