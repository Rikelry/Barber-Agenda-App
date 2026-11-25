// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { AtualizarProfissionalDTO, ProfissionalResponseDTO } from '../infra/http/dtos/ProfissionalDTO'

export interface IAtualizarProfissionalUseCase {
  executar(dados: AtualizarProfissionalDTO): Promise<ProfissionalResponseDTO>
}
