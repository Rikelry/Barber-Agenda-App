// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Usuario } from '../entities/Usuario'

export interface IUsuarioRepository {
  criar(dados: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Usuario>
  buscarPorId(id: string): Promise<Usuario | null>
  buscarPorEmail(email: string): Promise<Usuario | null>
  atualizar(id: string, dados: Partial<Pick<Usuario, 'name' | 'phone' | 'passwordHash' | 'role'>>): Promise<Usuario>
  deletar(id: string): Promise<void>
}