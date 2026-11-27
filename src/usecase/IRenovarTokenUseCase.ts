// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { LoginResponseDTO } from '../infra/http/dtos/UsuarioDTO'

export interface IRenovarTokenUseCase {
  executar(usuarioId: string): Promise<LoginResponseDTO>
}
