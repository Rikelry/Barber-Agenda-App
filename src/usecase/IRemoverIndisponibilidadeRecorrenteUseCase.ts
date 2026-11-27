// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { RemoverIndisponibilidadeRecorrenteDTO } from '../infra/http/dtos/IndisponibilidadeRecorrenteDTO'

export interface IRemoverIndisponibilidadeRecorrenteUseCase {
  executar(dados: RemoverIndisponibilidadeRecorrenteDTO): Promise<void>
}
