import { IUsuarioRepository } from '../domain/interfaces/IUsuarioRepository'
import { IAutenticarComGoogleUseCase } from '../domain/interfaces/IAutenticarComGoogleUseCase'
import { IVerificadorTokenGoogle } from '../domain/interfaces/IVerificadorTokenGoogle'
import { IBarbeariaRepository } from '../../barbershops/domain/interfaces/IBarbeariaRepository'
import { IProfissionalRepository } from '../../professionals/domain/interfaces/IProfissionalRepository'
import { GoogleLoginDTO, LoginResponseDTO } from '../adapters/dtos/UsuarioDTO'
import { Usuario, paraUsuarioPublico } from '../domain/entidades/Usuario'
import { construirRolesUsuario } from './shared/construirRolesUsuario'
import { assinarToken } from '../../shared/utils/jwt'
import { AppError } from '../../shared/errors/AppError'

/**
 * Login com Google: valida o ID token junto ao Google e autentica o usuário
 * existente (por e-mail ou googleId) ou cria a conta automaticamente como
 * `cliente`. Contas Google não têm senha (passwordHash nulo).
 */
export class AutenticarComGoogleUseCase implements IAutenticarComGoogleUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly verificadorTokenGoogle: IVerificadorTokenGoogle,
    private readonly barbeariaRepository: IBarbeariaRepository,
    private readonly profissionalRepository: IProfissionalRepository
  ) {}

  async executar(dados: GoogleLoginDTO): Promise<LoginResponseDTO> {
    const payload = await this.verificadorTokenGoogle.verificar(dados.idToken)

    if (!payload.email) {
      throw new AppError('Não foi possível validar a sua conta Google. Tente novamente.', 401, 'INVALID_GOOGLE_TOKEN')
    }

    const email = payload.email.trim().toLowerCase()
    const nomeExibicao =
      [payload.givenName, payload.familyName].filter(Boolean).join(' ').trim() ||
      payload.name ||
      email.split('@')[0]

    let usuario = await this.usuarioRepository.buscarPorEmail(email)

    if (!usuario) {
      usuario = await this.usuarioRepository.buscarPorGoogleId(payload.sub)
    }

    if (!usuario) {
      usuario = await this.usuarioRepository.criar({
        name: nomeExibicao,
        email,
        phone: '',
        passwordHash: null,
        role: 'cliente',
        avatarUrl: payload.picture ?? null,
        googleId: payload.sub,
        nameEditedAt: null,
        avatarEditedAt: null,
      })
    } else {
      const dadosAtualizacao: Partial<
        Pick<Usuario, 'name' | 'googleId' | 'avatarUrl' | 'nameEditedAt' | 'avatarEditedAt'>
      > = {}

      if (!usuario.googleId) dadosAtualizacao.googleId = payload.sub

      if (!usuario.nameEditedAt && nomeExibicao && nomeExibicao !== usuario.name) {
        dadosAtualizacao.name = nomeExibicao
      }

      if (!usuario.avatarEditedAt && payload.picture && payload.picture !== usuario.avatarUrl) {
        dadosAtualizacao.avatarUrl = payload.picture
      }

      if (Object.keys(dadosAtualizacao).length > 0) {
        usuario = await this.usuarioRepository.atualizar(usuario.id, dadosAtualizacao)
      }
    }

    const roles = await construirRolesUsuario(usuario, this.barbeariaRepository, this.profissionalRepository)

    const token = assinarToken({
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      roles,
    })

    return { token, usuario: { ...paraUsuarioPublico(usuario), roles } }
  }
}
