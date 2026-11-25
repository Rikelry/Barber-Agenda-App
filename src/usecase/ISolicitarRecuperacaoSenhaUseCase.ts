// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { EsqueciSenhaDTO } from '../infra/http/dtos/UsuarioDTO'

export interface ISolicitarRecuperacaoSenhaUseCase {
  executar(dados: EsqueciSenhaDTO): Promise<{ message: string }>
}
