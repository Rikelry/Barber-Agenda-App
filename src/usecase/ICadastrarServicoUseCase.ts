// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { CadastrarServicoDTO, ServicoResponseDTO } from '../infra/http/dtos/ServicoDTO'

export interface ICadastrarServicoUseCase {
  executar(dados: CadastrarServicoDTO): Promise<ServicoResponseDTO>
}
