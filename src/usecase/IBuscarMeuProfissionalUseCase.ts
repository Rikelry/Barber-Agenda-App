// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface MeuProfissionalResponseDTO {
  id: string
  barbershopId: string
  specialty: string | null
}

export interface IBuscarMeuProfissionalUseCase {
  executar(userId: string): Promise<MeuProfissionalResponseDTO>
}
