// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Barbearia } from '../entities/Barbearia'

export interface IBarbeariaRepository {
  criar(data: Omit<Barbearia, 'id' | 'createdAt' | 'updatedAt'>): Promise<Barbearia>
  buscarPorOwnerId(ownerId: string): Promise<Barbearia | null>
  existePorOwnerId(ownerId: string): Promise<boolean>
  listar(): Promise<Barbearia[]>
  buscarPorId(id: string): Promise<Barbearia | null>
  atualizar(id: string, dados: Partial<Pick<Barbearia, 'name' | 'address' | 'phone'>>): Promise<Barbearia>
}
