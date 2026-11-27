// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import bcrypt from 'bcrypt'
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'
import { IAtualizarUsuarioUseCase } from './IAtualizarUsuarioUseCase'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { AtualizacaoDTO, UsuarioResponseDTO } from '../infra/http/dtos/UsuarioDTO'
import { paraUsuarioPublico } from '../model/entities/Usuario'
import { construirRolesUsuario } from './shared/construirRolesUsuario'
import { AppError } from '../infra/errors/AppError'

/**
 * RF019 — Atualização de Dados.
 * Usuário pode atualizar nome e telefone livremente. E-mail não pode ser
 * alterado (usuarios.md). Para trocar a senha, é obrigatório informar a
 * senha atual correta (validação de negócio adicional — o Zod só garante
 * que o campo foi enviado, não que a senha bate).
 */
export class AtualizarUsuarioUseCase implements IAtualizarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly barbeariaRepository: IBarbeariaRepository,
    private readonly profissionalRepository: IProfissionalRepository
  ) {}

  async executar(id: string, dados: AtualizacaoDTO): Promise<UsuarioResponseDTO> {
    const usuario = await this.usuarioRepository.buscarPorId(id)

    if (!usuario) {
      throw new AppError('Usuário não encontrado.', 404, 'USER_NOT_FOUND')
    }

    const payload: Partial<{ name: string; phone: string; passwordHash: string }> = {}

    if (dados.name !== undefined) payload.name = dados.name
    if (dados.phone !== undefined) payload.phone = dados.phone

    if (dados.newPassword) {
      // O schema (atualizacaoSchema) já garante que currentPassword veio
      // junto com newPassword — aqui validamos se ela está correta.
      const senhaAtualValida = await bcrypt.compare(dados.currentPassword!, usuario.passwordHash)

      if (!senhaAtualValida) {
        throw new AppError('Senha atual incorreta.', 401, 'INVALID_CURRENT_PASSWORD')
      }

      payload.passwordHash = await bcrypt.hash(dados.newPassword, 10)
    }

    const usuarioFinal =
      Object.keys(payload).length === 0
        ? usuario // Nada para atualizar — devolve o usuário como está, sem tocar no banco.
        : await this.usuarioRepository.atualizar(id, payload)

    const roles = await construirRolesUsuario(usuarioFinal, this.barbeariaRepository, this.profissionalRepository)

    return { ...paraUsuarioPublico(usuarioFinal), roles }
  }
}
