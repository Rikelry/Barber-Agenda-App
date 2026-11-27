// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { CadastrarProfissionalDTO, ProfissionalResponseDTO } from '../infra/http/dtos/ProfissionalDTO'

export interface ICadastrarProfissionalUseCase {
  executar(dados: CadastrarProfissionalDTO): Promise<ProfissionalResponseDTO>
}
