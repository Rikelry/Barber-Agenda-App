// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { RemoverIndisponibilidadeDTO } from '../infra/http/dtos/IndisponibilidadeDTO'

export interface IRemoverIndisponibilidadeUseCase {
  executar(dados: RemoverIndisponibilidadeDTO): Promise<void>
}
