// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Indisponibilidade } from '../model/entities/Indisponibilidade'
import { RegistrarIndisponibilidadeDTO } from '../infra/http/dtos/IndisponibilidadeDTO'

export interface IRegistrarIndisponibilidadeUseCase {
  executar(dados: RegistrarIndisponibilidadeDTO): Promise<Indisponibilidade>
}
