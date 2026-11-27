// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { ITornarSeProfissionalUseCase } from './ITornarSeProfissionalUseCase'
import { TornarSeProfissionalDTO } from '../infra/http/dtos/TornarSeProfissionalDTO'
import { ProfissionalResponseDTO } from '../infra/http/dtos/ProfissionalDTO'
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'

/**
 * Owner se auto-cadastra como profissional na própria barbearia — reaproveita
 * a mesma conta (user_id), diferente de CadastrarProfissionalUseCase, que
 * sempre cria uma conta nova para contratar alguém de fora. Um usuário pode
 * atender em várias barbearias (um vínculo por barbearia, desde 26/11/26);
 * bloqueia só se ele já for profissional nesta.
 */
export class TornarSeProfissionalUseCase implements ITornarSeProfissionalUseCase {
  constructor(
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(dados: TornarSeProfissionalDTO): Promise<ProfissionalResponseDTO> {
    const barbearia = await this.barbeariaRepository.buscarPorId(dados.barbershopId)

    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }

    if (barbearia.ownerId !== dados.ownerId) {
      throw new AppError('Você não tem permissão para acessar este recurso.', 403, 'FORBIDDEN')
    }

    const vinculos = await this.profissionalRepository.listarPorUserId(dados.ownerId)

    if (vinculos.some((v) => v.barbershopId === dados.barbershopId)) {
      throw new AppError('Você já atende nesta barbearia.', 409, 'ALREADY_PROFESSIONAL')
    }

    const usuario = await this.usuarioRepository.buscarPorId(dados.ownerId)

    if (!usuario) {
      throw new AppError('Usuário não encontrado.', 404, 'USER_NOT_FOUND')
    }

    const profissionalCriado = await this.profissionalRepository.criar({
      userId: usuario.id,
      barbershopId: dados.barbershopId,
      specialty: dados.specialty ?? null,
    })

    return {
      id: profissionalCriado.id,
      barbershopId: profissionalCriado.barbershopId,
      specialty: profissionalCriado.specialty,
      createdAt: profissionalCriado.createdAt,
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        phone: usuario.phone,
        role: usuario.role,
      },
    }
  }
}
