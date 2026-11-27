// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Agendamento } from '../entities/Agendamento'

export interface IAgendamentoRepository {
  listarPorProfissional(professionalId: string): Promise<Agendamento[]>
  listarPorProfissionalEData(professionalId: string, date: string): Promise<Agendamento[]>
  listarPorCliente(clientId: string): Promise<Agendamento[]>
  listarPorBarbearia(barbershopId: string): Promise<Agendamento[]>
  criar(data: Omit<Agendamento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agendamento>
  existeConflito(professionalId: string, date: string, startTime: string, endTime: string, excludedId?: string): Promise<boolean>
  buscarPorId(id: string): Promise<Agendamento | null>
  atualizar(id: string, data: Partial<Agendamento>): Promise<Agendamento>
}
