// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface IExcluirContaUseCase {
  execute(id: string): Promise<void>
}
