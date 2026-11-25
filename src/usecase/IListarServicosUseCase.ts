// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Servico } from '../model/entities/Servico'

export interface IListarServicosUseCase {
  executar(barbershopId: string): Promise<Servico[]>
}
