// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IServicoRepository } from '../model/datasources/IServicoRepository'
import { IAtualizarServicoUseCase } from './IAtualizarServicoUseCase'
import { AtualizarServicoDTO, ServicoResponseDTO } from '../infra/http/dtos/ServicoDTO'
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { AppError } from '../infra/errors/AppError'

/**
 * RF014 — Atualização de serviços da barbearia.
 * Apenas o owner da barbearia pode atualizar serviços (servicos.md, ADR-007).
 */
export class AtualizarServicoUseCase implements IAtualizarServicoUseCase {
  constructor(
    private readonly servicoRepository: IServicoRepository,
    private readonly barbeariaRepository: IBarbeariaRepository
  ) {}

  async executar(dados: AtualizarServicoDTO & { ownerId: string; serviceId: string }): Promise<ServicoResponseDTO> {
    const barbearia = await this.barbeariaRepository.buscarPorId(dados.barbershopId)

    if (!barbearia) {
      throw new AppError('Barbearia não encontrada.', 404, 'BARBERSHOP_NOT_FOUND')
    }

    if (barbearia.ownerId !== dados.ownerId) {
      throw new AppError('Você não tem permissão para acessar este recurso.', 403, 'FORBIDDEN')
    }

    const servico = await this.servicoRepository.buscarPorId(dados.serviceId, dados.barbershopId)

    if (!servico) {
        throw new AppError('Serviço não encontrado.', 404, 'SERVICE_NOT_FOUND')
    }

    return this.servicoRepository.atualizar(dados.serviceId, dados.barbershopId, {
      name: dados.name,
      description: dados.description,
      durationMinutes: dados.durationMinutes,
      price: dados.price,
      imageUrl: dados.imageUrl,
      avatarUrl: dados.avatarUrl,
    })
  }
}
