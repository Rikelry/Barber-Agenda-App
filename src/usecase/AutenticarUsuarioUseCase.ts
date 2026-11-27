// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import bcrypt from 'bcrypt'
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'
import { IAutenticarUsuarioUseCase } from './IAutenticarUsuarioUseCase'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { LoginDTO, LoginResponseDTO } from '../infra/http/dtos/UsuarioDTO'
import { paraUsuarioPublico } from '../model/entities/Usuario'
import { construirRolesUsuario } from './shared/construirRolesUsuario'
import { assinarToken } from '../infra/utils/jwt'
import { AppError } from '../infra/errors/AppError'

export class AutenticarUsuarioUseCase implements IAutenticarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly barbeariaRepository: IBarbeariaRepository,
    private readonly profissionalRepository: IProfissionalRepository
  ) {}

  async executar(dados: LoginDTO): Promise<LoginResponseDTO> {
    const email = dados.email.trim().toLowerCase()
    const usuario = await this.usuarioRepository.buscarPorEmail(email)

    // Credenciais incorretas retornam 401 sem indicar qual campo está errado (usuarios.md)
    if (!usuario) {
      throw new AppError('E-mail ou senha inválidos.', 401, 'INVALID_CREDENTIALS')
    }

    const senhaValida = await bcrypt.compare(dados.password, usuario.passwordHash)

    if (!senhaValida) {
      throw new AppError('E-mail ou senha inválidos.', 401, 'INVALID_CREDENTIALS')
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