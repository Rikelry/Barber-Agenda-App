// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { CadastroDTO, UsuarioResponseDTO } from '../infra/http/dtos/UsuarioDTO'

export interface ICadastrarUsuarioUseCase {
  executar(dados: CadastroDTO): Promise<UsuarioResponseDTO>
}