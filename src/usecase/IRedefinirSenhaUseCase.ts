// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { RedefinirSenhaDTO } from '../infra/http/dtos/UsuarioDTO'

export interface IRedefinirSenhaUseCase {
  executar(dados: RedefinirSenhaDTO): Promise<{ message: string }>
}
