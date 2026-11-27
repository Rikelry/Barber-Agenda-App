// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { AtualizacaoDTO, UsuarioResponseDTO } from '../infra/http/dtos/UsuarioDTO'

export interface IAtualizarUsuarioUseCase {
  executar(id: string, dados: AtualizacaoDTO): Promise<UsuarioResponseDTO>
}
