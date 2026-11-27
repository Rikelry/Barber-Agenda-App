// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { LoginDTO, LoginResponseDTO } from '../infra/http/dtos/UsuarioDTO'

export interface IAutenticarUsuarioUseCase {
  executar(dados: LoginDTO): Promise<LoginResponseDTO>
}