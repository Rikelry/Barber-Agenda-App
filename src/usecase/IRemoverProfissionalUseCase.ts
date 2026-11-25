// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { RemoverProfissionalDTO } from '../infra/http/dtos/ProfissionalDTO'

export interface IRemoverProfissionalUseCase {
  executar(dados: RemoverProfissionalDTO): Promise<void>
}
