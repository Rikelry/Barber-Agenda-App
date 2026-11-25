// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IndisponibilidadeRecorrente } from '../model/entities/IndisponibilidadeRecorrente'
import { RegistrarIndisponibilidadeRecorrenteDTO } from '../infra/http/dtos/IndisponibilidadeRecorrenteDTO'

export interface IRegistrarIndisponibilidadeRecorrenteUseCase {
  executar(dados: RegistrarIndisponibilidadeRecorrenteDTO): Promise<IndisponibilidadeRecorrente>
}
