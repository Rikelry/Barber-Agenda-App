// modules/usuarios/domain/Usuario.ts
export type Role = 'cliente' | 'profissional' | 'owner'

export interface Usuario {
  id: string
  name: string
  email: string
  phone: string
  passwordHash: string | null
  role: Role
  avatarUrl: string | null
  googleId: string | null
  nameEditedAt: string | null
  avatarEditedAt: string | null
  createdAt: string
  updatedAt: string
}

export type UsuarioPublico = Omit<Usuario, 'passwordHash' | 'googleId' | 'nameEditedAt' | 'avatarEditedAt'>

export function paraUsuarioPublico(usuario: Usuario): UsuarioPublico {
  const { passwordHash, googleId, nameEditedAt, avatarEditedAt, ...usuarioPublico } = usuario
  return usuarioPublico
}
