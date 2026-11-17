// Agendamentos na API (/agendamentos e available-slots). Converte o AgendamentoResponseDTO
// do backend (backend/src/agendamentos/adapters/dtos/AgendamentoDTO.ts) na entidade.

import type { AppointmentData, BookingRequest, IAppointmentDataSource } from "@/model/datasources/iAppointmentDataSource";
import type { AppointmentStatus } from "@/model/entities/appointment";
import { DomainError } from "@/model/errors";
import type { IApiService } from "@/model/services/iApiService";

type AgendamentoDto = {
  id: string;
  barbershopId: string;
  status: "agendado" | "concluido" | "cancelado";
  professional: { id: string; name: string };
  service: { id: string; name: string; duration: number };
  date: string;
  startTime: string;
  endTime: string;
};

const STATUS: Record<AgendamentoDto["status"], AppointmentStatus> = {
  agendado: "confirmed",
  concluido: "completed",
  cancelado: "cancelled",
};

const dataHora = (date: string, time: string): Date => {
  const [ano, mes, dia] = date.slice(0, 10).split("-").map(Number);
  const [hora, minuto] = time.split(":").map(Number);
  return new Date(ano ?? 0, (mes ?? 1) - 1, dia ?? 1, hora ?? 0, minuto ?? 0);
};

export const toAppointment = (dto: AgendamentoDto): AppointmentData => ({
  id: dto.id,
  barbershopId: dto.barbershopId,
  professionalId: dto.professional.id,
  professionalName: dto.professional.name,
  serviceId: dto.service.id,
  serviceName: dto.service.name,
  durationMinutes: dto.service.duration,
  startsAt: dataHora(dto.date, dto.startTime),
  endsAt: dataHora(dto.date, dto.endTime),
  status: STATUS[dto.status] ?? "confirmed",
});

const lista = <T>(dados: unknown, chave: string): T[] => {
  const valor = typeof dados === "object" && dados !== null ? (dados as Record<string, unknown>)[chave] : undefined;
  if (!Array.isArray(valor)) throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
  return valor as T[];
};

const segmento = (id: string) => encodeURIComponent(id);

export class HttpAppointmentDataSource implements IAppointmentDataSource {
  constructor(private readonly api: IApiService) {}

  async listMine(): Promise<AppointmentData[]> {
    return lista<AgendamentoDto>(await this.api.get("/agendamentos"), "agendamentos").map(toAppointment);
  }

  async create(request: BookingRequest): Promise<AppointmentData> {
    return toAppointment(await this.api.post<AgendamentoDto>("/agendamentos", request));
  }

  async cancel(appointmentId: string): Promise<void> {
    await this.api.patch(`/agendamentos/${segmento(appointmentId)}/cancelar`);
  }

  async reschedule(appointmentId: string, date: string, time: string): Promise<AppointmentData> {
    return toAppointment(
      await this.api.patch<AgendamentoDto>(`/agendamentos/${segmento(appointmentId)}/reschedule`, { date, time }),
    );
  }

  async listAvailableSlots(barbershopId: string, professionalId: string, serviceId: string, date: string): Promise<string[]> {
    const query = `?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`;
    const resposta = await this.api.get(
      `/barbershops/${segmento(barbershopId)}/professionals/${segmento(professionalId)}/available-slots${query}`,
    );
    return lista<string>(resposta, "slots").map((h) => h.slice(0, 5));
  }
}
