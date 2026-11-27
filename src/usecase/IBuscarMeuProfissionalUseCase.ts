// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface MeuProfissionalResponseDTO {
  id: string
  barbershopId: string
  specialty: string | null
}

export interface IBuscarMeuProfissionalUseCase {
  /** Com barbershopId, o vínculo naquela barbearia; sem, o primeiro. */
  executar(userId: string, barbershopId?: string): Promise<MeuProfissionalResponseDTO>
  /** Todos os vínculos do usuário (um por barbearia onde atende). */
  listar(userId: string): Promise<MeuProfissionalResponseDTO[]>
}
