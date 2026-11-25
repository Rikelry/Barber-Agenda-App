// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import bcrypt from 'bcrypt'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { ICadastrarProfissionalUseCase } from './ICadastrarProfissionalUseCase'
import { CadastrarProfissionalDTO, ProfissionalResponseDTO } from '../infra/http/dtos/ProfissionalDTO'
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'

/**
 * RF003 — Cadastro de profissionais na barbearia.
 * Apenas o owner da barbearia pode cadastrar profissionais (barbeiros.md, ADR-007).
 * O cadastro cria uma conta de usuário nova (role: profissional) e o vínculo
 * com a barbearia na mesma operação — não existe fluxo de "promover" um
 * cliente já cadastrado neste RF.
 */
export class CadastrarProfissionalUseCase implements ICadastrarProfissionalUseCase {
  constructor(
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(dados: CadastrarProfissionalDTO): Promise<ProfissionalResponseDTO> {
    const barbearia = await this.barbeariaRepository.buscarPorId(dados.barbershopId)

    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }

    if (barbearia.ownerId !== dados.ownerId) {
      throw new AppError('Você não tem permissão para acessar este recurso.', 403, 'FORBIDDEN')
    }

    const email = dados.email.trim().toLowerCase()
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email)

    if (usuarioExistente) {
      throw new AppError('E-mail já cadastrado.', 409, 'EMAIL_ALREADY_EXISTS')
    }

    const SALT_ROUNDS = 10
    const passwordHash = await bcrypt.hash(dados.password, SALT_ROUNDS)

    const usuarioCriado = await this.usuarioRepository.criar({
      name: dados.name,
      email,
      phone: dados.phone,
      passwordHash,
      role: 'profissional',
    })

    const profissionalCriado = await this.profissionalRepository.criar({
      userId: usuarioCriado.id,
      barbershopId: dados.barbershopId,
      specialty: dados.specialty ?? null,
    })

    return {
      id: profissionalCriado.id,
      barbershopId: profissionalCriado.barbershopId,
      specialty: profissionalCriado.specialty,
      createdAt: profissionalCriado.createdAt,
      usuario: {
        id: usuarioCriado.id,
        name: usuarioCriado.name,
        email: usuarioCriado.email,
        phone: usuarioCriado.phone,
        role: usuarioCriado.role,
      },
    }
  }
}
