// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Barbearia } from '../model/entities/Barbearia'
import { CriarBarbeariaDTO } from '../infra/http/dtos/BarbeariaDTO'

export interface ICriarBarbeariaUseCase {
  executar(dados: CriarBarbeariaDTO): Promise<Barbearia>
}
