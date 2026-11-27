// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { TornarSeProfissionalDTO } from '../infra/http/dtos/TornarSeProfissionalDTO'
import { ProfissionalResponseDTO } from '../infra/http/dtos/ProfissionalDTO'

export interface ITornarSeProfissionalUseCase {
  executar(dados: TornarSeProfissionalDTO): Promise<ProfissionalResponseDTO>
}
