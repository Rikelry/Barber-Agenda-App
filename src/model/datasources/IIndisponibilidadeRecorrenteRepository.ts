// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IndisponibilidadeRecorrente } from '../entities/IndisponibilidadeRecorrente'

export interface IIndisponibilidadeRecorrenteRepository {
  criar(data: Omit<IndisponibilidadeRecorrente, 'id' | 'createdAt'>): Promise<IndisponibilidadeRecorrente>
  remover(id: string, professionalId: string): Promise<void>
  listarPorProfissional(professionalId: string): Promise<IndisponibilidadeRecorrente[]>
  buscarPorId(id: string, professionalId: string): Promise<IndisponibilidadeRecorrente | null>
  existeConflito(professionalId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<boolean>
}
