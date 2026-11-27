// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IAgendamentoRepository } from '../model/datasources/IAgendamentoRepository'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IServicoRepository } from '../model/datasources/IServicoRepository'
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'
import { AgendamentoResponseDTO } from '../infra/http/dtos/AgendamentoDTO'
import { propostaDe } from '../model/entities/Agendamento'

export class ListarAgendamentosClienteUseCase {
  constructor(
    private readonly agendamentoRepository: IAgendamentoRepository,
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly servicoRepository: IServicoRepository,
    private readonly usuarioRepository: IUsuarioRepository
  ) {}

  async executar(clientId: string): Promise<AgendamentoResponseDTO[]> {
    const agendamentos = await this.agendamentoRepository.listarPorCliente(clientId)
    
    const agendamentosFormatados = await Promise.all(
        agendamentos.map(async (agendamento) => {
            const profissional = await this.profissionalRepository.buscarPorIdGlobal(agendamento.professionalId)
            const servico = await this.servicoRepository.buscarPorId(agendamento.serviceId, agendamento.barbershopId)
            const usuarioProfissional = profissional ? await this.usuarioRepository.buscarPorId(profissional.userId) : null

            return {
                id: agendamento.id,
              barbershopId: agendamento.barbershopId,
                status: agendamento.status,
                professional: { id: profissional?.id ?? '', name: usuarioProfissional?.name ?? '' },
                service: { id: servico?.id ?? '', name: servico?.name ?? '', duration: servico?.durationMinutes ?? 0 },
                date: agendamento.date,
                startTime: agendamento.startTime.slice(0, 5),
                endTime: agendamento.endTime.slice(0, 5),
                rejectionReason: agendamento.rejectionReason ?? null,
                proposal: propostaDe(agendamento),
                createdAt: agendamento.createdAt,
            }
        })
    )

    return agendamentosFormatados
  }
}
