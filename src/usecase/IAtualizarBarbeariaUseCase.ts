// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Barbearia } from '../model/entities/Barbearia'
import { AtualizarBarbeariaDTO } from '../infra/http/dtos/BarbeariaDTO'

export interface IAtualizarBarbeariaUseCase {
  executar(id: string, ownerId: string, dados: AtualizarBarbeariaDTO): Promise<Barbearia>
}
