// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'
import { IBuscarUsuarioUseCase } from './IBuscarUsuarioUseCase'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { paraUsuarioPublico } from '../model/entities/Usuario'
import { UsuarioResponseDTO } from '../infra/http/dtos/UsuarioDTO'
import { construirRolesUsuario } from './shared/construirRolesUsuario'
import { AppError } from '../infra/errors/AppError'

export class BuscarUsuarioUseCase implements IBuscarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly barbeariaRepository: IBarbeariaRepository,
    private readonly profissionalRepository: IProfissionalRepository
  ) {}

  async executar(id: string): Promise<UsuarioResponseDTO> {
    const usuario = await this.usuarioRepository.buscarPorId(id)

    if (!usuario) {
      throw new AppError('Usuário não encontrado.', 404, 'USER_NOT_FOUND')
    }

    const roles = await construirRolesUsuario(usuario, this.barbeariaRepository, this.profissionalRepository)

    return { ...paraUsuarioPublico(usuario), roles }
  }
}