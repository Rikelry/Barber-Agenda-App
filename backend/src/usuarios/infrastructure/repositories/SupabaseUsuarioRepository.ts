// modules/usuarios/infrastructure/SupabaseUsuarioRepository.ts
import { supabase } from '../../../shared/database/supabase'
import { Usuario } from '../../domain/entidades/Usuario'
import { IUsuarioRepository } from '../../domain/interfaces/IUsuarioRepository'

function mapRowParaUsuario(row: any): Usuario {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    passwordHash: row.password_hash ?? null,
    role: row.role,
    avatarUrl: row.avatar_url ?? null,
    googleId: row.google_id ?? null,
    nameEditedAt: row.name_edited_at ?? null,
    avatarEditedAt: row.avatar_edited_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class SupabaseUsuarioRepository implements IUsuarioRepository {
  async criar(dados: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Usuario> {
    const payload: Record<string, any> = {
      name: dados.name,
      email: dados.email,
      phone: dados.phone,
      password_hash: dados.passwordHash,
      role: dados.role,
    }
    if (dados.avatarUrl) payload.avatar_url = dados.avatarUrl
    if (dados.googleId) payload.google_id = dados.googleId
    if (dados.nameEditedAt) payload.name_edited_at = dados.nameEditedAt
    if (dados.avatarEditedAt) payload.avatar_edited_at = dados.avatarEditedAt

    const { data, error } = await supabase
      .from('users')
      .insert(payload)
      .select('*')
      .single()

    if (error) throw new Error(`Erro ao criar usuário: ${error.message}`)
    return mapRowParaUsuario(data)
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(`Erro ao buscar usuário por id: ${error.message}`)
    return data ? mapRowParaUsuario(data) : null
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (error) throw new Error(`Erro ao buscar usuário por e-mail: ${error.message}`)
    return data ? mapRowParaUsuario(data) : null
  }

  async buscarPorGoogleId(googleId: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .maybeSingle()

    if (error) throw new Error(`Erro ao buscar usuário por googleId: ${error.message}`)
    return data ? mapRowParaUsuario(data) : null
  }

  async atualizar(
    id: string,
    dados: Partial<
      Pick<
        Usuario,
        'name' | 'phone' | 'passwordHash' | 'role' | 'avatarUrl' | 'googleId' | 'nameEditedAt' | 'avatarEditedAt'
      >
    >
  ): Promise<Usuario> {
    const payload: Record<string, any> = { updated_at: new Date().toISOString() }
    if (dados.name !== undefined) payload.name = dados.name
    if (dados.phone !== undefined) payload.phone = dados.phone
    if (dados.passwordHash !== undefined) payload.password_hash = dados.passwordHash
    if (dados.role !== undefined) payload.role = dados.role
    if (dados.avatarUrl !== undefined) payload.avatar_url = dados.avatarUrl
    if (dados.googleId !== undefined) payload.google_id = dados.googleId
    if (dados.nameEditedAt !== undefined) payload.name_edited_at = dados.nameEditedAt
    if (dados.avatarEditedAt !== undefined) payload.avatar_edited_at = dados.avatarEditedAt

    const { data, error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(`Erro ao atualizar usuário: ${error.message}`)
    return mapRowParaUsuario(data)
  }

  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Erro ao deletar usuário: ${error.message}`)
  }
}
