// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Barbearia } from '../model/entities/Barbearia'

export interface IBuscarBarbeariaPorIdUseCase {
  executar(id: string): Promise<Barbearia>
}
