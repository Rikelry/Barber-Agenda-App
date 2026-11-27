// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IServicoRepository } from '../model/datasources/IServicoRepository'
import { ICadastrarServicoUseCase } from './ICadastrarServicoUseCase'
import { CadastrarServicoDTO, ServicoResponseDTO } from '../infra/http/dtos/ServicoDTO'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'

/**
 * RF014 — Cadastro de serviços da barbearia.
 * Apenas o owner da barbearia pode cadastrar serviços (servicos.md, ADR-007).
 */
export class CadastrarServicoUseCase implements ICadastrarServicoUseCase {
  constructor(
    private readonly servicoRepository: IServicoRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(dados: CadastrarServicoDTO): Promise<ServicoResponseDTO> {
    const barbearia = await this.barbeariaRepository.buscarPorId(dados.barbershopId)

    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }

    if (barbearia.ownerId !== dados.ownerId) {
      throw new AppError('Você não tem permissão para acessar este recurso.', 403, 'FORBIDDEN')
    }

    return this.servicoRepository.criar({
      barbershopId: dados.barbershopId,
      name: dados.name,
      description: dados.description ?? null,
      durationMinutes: dados.durationMinutes,
      price: dados.price,
      imageUrl: dados.imageUrl ?? null,
      avatarUrl: dados.avatarUrl ?? null,
    })
  }
}
