// Agendas na API: /agendamentos/minha-agenda (profissional) e /agendamentos/barbearia/:id (dono),
// com aprovar, recusar (com motivo), sugerir outro horário, iniciar, concluir, não compareceu,
// cancelar e remarcar. Converte o AgendaItemDTO do backend
// (src/infra/http/dtos/AgendamentoDTO.ts) na entidade.

import type { AgendaScope, IAgendaDataSource } from "@/model/datasources/iAgendaDataSource";
import type { AgendaAppointment } from "@/model/entities/agendaAppointment";
import type { AppointmentStatus } from "@/model/entities/appointment";
import { DomainError } from "@/model/errors";
import type { IApiService } from "@/model/services/iApiService";

type AgendaItemDto = {
  id: string;
  barbershopId: string;
  status: "pendente" | "aguardando_cliente" | "agendado" | "em_andamento" | "concluido" | "recusado" | "cancelado" | "nao_compareceu";
  client: { id: string; name: string; phone: string };
  professional: { id: string; name: string };
  service: { id: string; name: string; duration: number };
  date: string;
  startTime: string;
  endTime: string;
  rejectionReason?: string | null;
  proposal?: { date: string; startTime: string; endTime: string } | null;
};

const STATUS: Record<AgendaItemDto["status"], AppointmentStatus> = {
  pendente: "pending",
  aguardando_cliente: "awaiting_client",
  agendado: "confirmed",
  em_andamento: "in_progress",
  concluido: "completed",
  recusado: "rejected",
  cancelado: "cancelled",
  nao_compareceu: "no_show",
};

const dataHora = (date: string, time: string): Date => {
  const [ano, mes, dia] = date.slice(0, 10).split("-").map(Number);
  const [hora, minuto] = time.split(":").map(Number);
  return new Date(ano ?? 0, (mes ?? 1) - 1, dia ?? 1, hora ?? 0, minuto ?? 0);
};

export const toAgendaAppointment = (dto: AgendaItemDto): AgendaAppointment => ({
  id: dto.id,
  barbershopId: dto.barbershopId,
  professionalId: dto.professional.id,
  professionalName: dto.professional.name,
  clientName: dto.client.name,
  clientPhone: dto.client.phone,
  serviceId: dto.service.id,
  serviceName: dto.service.name,
  durationMinutes: dto.service.duration,
  startsAt: dataHora(dto.date, dto.startTime),
  endsAt: dataHora(dto.date, dto.endTime),
  status: STATUS[dto.status] ?? "confirmed",
  proposal: dto.proposal
    ? { startsAt: dataHora(dto.proposal.date, dto.proposal.startTime), endsAt: dataHora(dto.proposal.date, dto.proposal.endTime) }
    : null,
  rejectionReason: dto.rejectionReason ?? null,
});

const lista = <T>(dados: unknown, chave: string): T[] => {
  const valor = typeof dados === "object" && dados !== null ? (dados as Record<string, unknown>)[chave] : undefined;
  if (!Array.isArray(valor)) throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
  return valor as T[];
};

const segmento = (id: string) => encodeURIComponent(id);

export class HttpAgendaDataSource implements IAgendaDataSource {
  constructor(private readonly api: IApiService) {}

  async list(scope: AgendaScope): Promise<AgendaAppointment[]> {
    // Na agenda do profissional, o backend devolve só os dele (filtrando pela barbearia, se houver).
    const rota =
      scope.kind === "professional"
        ? `/agendamentos/minha-agenda${scope.barbershopId ? `?barbershopId=${encodeURIComponent(scope.barbershopId)}` : ""}`
        : `/agendamentos/barbearia/${segmento(scope.barbershopId)}`;
    return lista<AgendaItemDto>(await this.api.get(rota), "agendamentos").map(toAgendaAppointment);
  }

  async approve(appointmentId: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/aprovar`);
  }

  async reject(appointmentId: string, reason?: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/recusar`, reason ? { motivo: reason } : {});
  }

  async propose(appointmentId: string, date: string, time: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/sugerir`, { date, time });
  }

  async start(appointmentId: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/iniciar`);
  }

  async noShow(appointmentId: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/nao-compareceu`);
  }

  async complete(appointmentId: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/concluir`);
  }

  async cancel(appointmentId: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/cancelar`);
  }

  async reschedule(appointmentId: string, date: string, time: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/reschedule`, { date, time });
  }

  async listAvailableSlots(barbershopId: string, professionalId: string, serviceId: string, date: string): Promise<string[]> {
    const query = `?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`;
    const resposta = await this.api.get(
      `/barbershops/${segmento(barbershopId)}/professionals/${segmento(professionalId)}/available-slots${query}`,
    );
    return lista<string>(resposta, "slots").map((h) => h.slice(0, 5));
  }
}
