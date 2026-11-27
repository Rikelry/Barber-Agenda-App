// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import {
  IBuscarMeuProfissionalUseCase,
  MeuProfissionalResponseDTO,
} from './IBuscarMeuProfissionalUseCase'
import { AppError } from '../infra/errors/AppError'

/**
 * Devolve o vínculo de profissional do próprio usuário logado (id +
 * barbershopId), usado pelo frontend para montar as chamadas de
 * agenda/indisponibilidade sem precisar saber esses ids de antemão —
 * mesma busca (`buscarPorUserId`) já usada internamente por
 * AgendamentoController.listarMinhaAgenda, aqui exposta como endpoint.
 */
export class BuscarMeuProfissionalUseCase implements IBuscarMeuProfissionalUseCase {
  constructor(private readonly profissionalRepository: IProfissionalRepository) {}

  async listar(userId: string): Promise<MeuProfissionalResponseDTO[]> {
    return (await this.profissionalRepository.listarPorUserId(userId)).map((p) => ({
      id: p.id,
      barbershopId: p.barbershopId,
      specialty: p.specialty,
    }))
  }

  async executar(userId: string, barbershopId?: string): Promise<MeuProfissionalResponseDTO> {
    const profissional = barbershopId
      ? (await this.profissionalRepository.listarPorUserId(userId)).find((p) => p.barbershopId === barbershopId) ?? null
      : await this.profissionalRepository.buscarPorUserId(userId)

    if (!profissional) {
      throw new AppError('Profissional não encontrado para este usuário.', 404, 'PROFESSIONAL_NOT_FOUND')
    }

    return {
      id: profissional.id,
      barbershopId: profissional.barbershopId,
      specialty: profissional.specialty,
    }
  }
}
