import { Usuario } from '../entidades/Usuario'

export interface IUsuarioRepository {
  criar(dados: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Usuario>
  buscarPorId(id: string): Promise<Usuario | null>
  buscarPorEmail(email: string): Promise<Usuario | null>
  buscarPorGoogleId(googleId: string): Promise<Usuario | null>
  atualizar(
    id: string,
    dados: Partial<
      Pick<
        Usuario,
        'name' | 'phone' | 'passwordHash' | 'role' | 'avatarUrl' | 'googleId' | 'nameEditedAt' | 'avatarEditedAt'
      >
    >
  ): Promise<Usuario>
  deletar(id: string): Promise<void>
}
