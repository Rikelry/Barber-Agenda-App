// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { ProfissionalPublico } from '../model/entities/Profissional'

export interface IListarProfissionaisUseCase {
  executar(barbershopId: string): Promise<ProfissionalPublico[]>
}
