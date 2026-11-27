// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Agendamento, propostaDe } from '../model/entities/Agendamento'
import { AgendaItemDTO } from '../infra/http/dtos/AgendamentoDTO'
import { IProfissionalRepository } from '../model/datasources/IProfissionalRepository'
import { IServicoRepository } from '../model/datasources/IServicoRepository'
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'

/**
 * Junta a cada agendamento o nome do cliente, do profissional e do serviço — o que as agendas
 * do profissional e da barbearia precisam para aprovar, recusar ou reagendar um pedido.
 */
export class MontarItensDeAgenda {
  constructor(
    private readonly profissionalRepository: IProfissionalRepository,
    private readonly servicoRepository: IServicoRepository,
    private readonly usuarioRepository: IUsuarioRepository
  ) {}

  async executar(agendamentos: Agendamento[]): Promise<AgendaItemDTO[]> {
    return Promise.all(
      agendamentos.map(async (agendamento) => {
        const [cliente, profissional, servico] = await Promise.all([
          this.usuarioRepository.buscarPorId(agendamento.clientId),
          this.profissionalRepository.buscarPorIdGlobal(agendamento.professionalId),
          this.servicoRepository.buscarPorId(agendamento.serviceId, agendamento.barbershopId),
        ])
        const usuarioProfissional = profissional ? await this.usuarioRepository.buscarPorId(profissional.userId) : null

        return {
          id: agendamento.id,
          barbershopId: agendamento.barbershopId,
          status: agendamento.status,
          client: { id: agendamento.clientId, name: cliente?.name ?? '', phone: cliente?.phone ?? '' },
          professional: { id: agendamento.professionalId, name: usuarioProfissional?.name ?? '' },
          service: { id: agendamento.serviceId, name: servico?.name ?? '', duration: servico?.durationMinutes ?? 0 },
          date: agendamento.date,
          startTime: agendamento.startTime.slice(0, 5),
          endTime: agendamento.endTime.slice(0, 5),
          rejectionReason: agendamento.rejectionReason ?? null,
          proposal: propostaDe(agendamento),
          createdAt: agendamento.createdAt,
        }
      })
    )
  }
}
