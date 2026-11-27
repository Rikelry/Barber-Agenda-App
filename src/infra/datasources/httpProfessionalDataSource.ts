// Agenda e bloqueios do profissional logado: /professionals/me, /agendamentos/minha-agenda e
// /barbershops/:b/professionals/:p/(recurring-)unavailability.

import type {
  AgendaAppointmentData,
  IProfessionalDataSource,
  ProfessionalIdentity,
} from "@/model/datasources/iProfessionalDataSource";
import type { AppointmentStatus } from "@/model/entities/appointment";
import type { RecurringUnavailability, Unavailability } from "@/model/entities/unavailability";
import { DomainError } from "@/model/errors";
import type { IApiService } from "@/model/services/iApiService";

type AgendamentoDto = {
  id: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pendente" | "aguardando_cliente" | "agendado" | "em_andamento" | "concluido" | "recusado" | "cancelado" | "nao_compareceu";
};
type IndisponibilidadeDto = { id: string; startsAt: string; endsAt: string; reason: string | null };
type RecorrenteDto = { id: string; dayOfWeek: number; startTime: string; endTime: string; reason: string | null };

const STATUS: Record<AgendamentoDto["status"], AppointmentStatus> = {
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
  const [a, m, d] = date.slice(0, 10).split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(a ?? 0, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0);
};

const lista = <T>(dados: unknown, chave?: string): T[] => {
  const valor = chave && typeof dados === "object" && dados !== null ? (dados as Record<string, unknown>)[chave] : dados;
  if (!Array.isArray(valor)) throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
  return valor as T[];
};

const base = (who: ProfessionalIdentity) =>
  `/barbershops/${encodeURIComponent(who.barbershopId)}/professionals/${encodeURIComponent(who.professionalId)}`;

export class HttpProfessionalDataSource implements IProfessionalDataSource {
  constructor(private readonly api: IApiService) {}

  async listMyWorkplaces(): Promise<ProfessionalIdentity[]> {
    const resposta = await this.api.get<{ vinculos?: { id: string; barbershopId: string; specialty?: string | null }[] }>(
      "/professionals/me/vinculos",
    );
    return lista<{ id: string; barbershopId: string; specialty?: string | null }>(resposta, "vinculos").map((v) => ({
      professionalId: v.id,
      barbershopId: v.barbershopId,
      specialty: v.specialty ?? null,
    }));
  }

  async getMe(barbershopId?: string): Promise<ProfessionalIdentity> {
    const eu = await this.api.get<{ id?: string; barbershopId?: string; specialty?: string | null }>(
      `/professionals/me${barbershopId ? `?barbershopId=${encodeURIComponent(barbershopId)}` : ""}`,
    );
    if (!eu?.id || !eu.barbershopId) {
      throw new DomainError("Sua conta não está vinculada a uma barbearia como profissional.", "NOT_FOUND");
    }
    return { professionalId: eu.id, barbershopId: eu.barbershopId, specialty: eu.specialty ?? null };
  }

  async listMyAgenda(): Promise<AgendaAppointmentData[]> {
    return lista<AgendamentoDto>(await this.api.get("/agendamentos/minha-agenda"), "agendamentos").map((a) => ({
      id: a.id,
      serviceId: a.serviceId,
      startsAt: dataHora(a.date, a.startTime),
      endsAt: dataHora(a.date, a.endTime),
      status: STATUS[a.status] ?? "confirmed",
    }));
  }

  async completeAppointment(appointmentId: string): Promise<void> {
    await this.api.patch(`/agendamentos/${encodeURIComponent(appointmentId)}/concluir`);
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    await this.api.patch(`/agendamentos/${encodeURIComponent(appointmentId)}/cancelar`);
  }

  async listUnavailabilities(who: ProfessionalIdentity): Promise<Unavailability[]> {
    return lista<IndisponibilidadeDto>(await this.api.get(`${base(who)}/unavailability`)).map((u) => ({
      id: u.id,
      startsAt: new Date(u.startsAt),
      endsAt: new Date(u.endsAt),
      reason: u.reason,
    }));
  }

  async addUnavailability(who: ProfessionalIdentity, startsAt: Date, endsAt: Date, reason?: string): Promise<void> {
    await this.api.post(`${base(who)}/unavailability`, {
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      ...(reason && { reason }),
    });
  }

  async removeUnavailability(who: ProfessionalIdentity, id: string): Promise<void> {
    await this.api.delete(`${base(who)}/unavailability/${encodeURIComponent(id)}`);
  }

  async listRecurringUnavailabilities(who: ProfessionalIdentity): Promise<RecurringUnavailability[]> {
    return lista<RecorrenteDto>(await this.api.get(`${base(who)}/recurring-unavailability`)).map((r) => ({
      id: r.id,
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime.slice(0, 5),
      endTime: r.endTime.slice(0, 5),
      reason: r.reason,
    }));
  }

  async addRecurringUnavailability(
    who: ProfessionalIdentity,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    reason?: string,
  ): Promise<void> {
    await this.api.post(`${base(who)}/recurring-unavailability`, {
      dayOfWeek,
      startTime,
      endTime,
      ...(reason && { reason }),
    });
  }

  async removeRecurringUnavailability(who: ProfessionalIdentity, id: string): Promise<void> {
    await this.api.delete(`${base(who)}/recurring-unavailability/${encodeURIComponent(id)}`);
  }
}
