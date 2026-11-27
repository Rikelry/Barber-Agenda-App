// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { UsuarioResponseDTO } from '../infra/http/dtos/UsuarioDTO'

export interface IBuscarUsuarioUseCase {
  executar(id: string): Promise<UsuarioResponseDTO>
}
