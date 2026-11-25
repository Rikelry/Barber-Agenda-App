// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface IVerificarBloqueioUseCase {
  executar(professionalId: string, startsAt: string, endsAt: string): Promise<boolean>
}
