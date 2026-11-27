import type { AgendaScope, IAgendaDataSource } from "@/model/datasources/iAgendaDataSource";
import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { IProfessionalDataSource } from "@/model/datasources/iProfessionalDataSource";
import type { AgendaAppointment } from "@/model/entities/agendaAppointment";
import { DomainError, ValidationError } from "@/model/errors";
import type { AgendaEntry, AgendaOverview, AgendaWorkplace, IAgendaUseCases } from "@/usecase/iAgendaUseCases";

/** Faixas livres menores que isso não aparecem (não cabe um atendimento). */
const MENOR_FAIXA_LIVRE_MIN = 30;
/** Dá para iniciar um atendimento a partir de alguns minutos antes do horário. */
const INICIO_ANTECIPADO_MIN = 15;
const MOTIVO_MAX = 200;

const doisDigitos = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" no fuso do aparelho. */
const isoDoDia = (d: Date) => `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;

/** Data "YYYY-MM-DD" + hora "HH:mm" no fuso do aparelho. */
const naData = (date: string, hora: string): Date => {
  const [ano, mes, dia] = date.split("-").map(Number);
  const [h, m] = hora.split(":").map(Number);
  return new Date(ano ?? 0, (mes ?? 1) - 1, dia ?? 1, h ?? 0, m ?? 0);
};

const porHorario = (a: AgendaAppointment, b: AgendaAppointment) => a.startsAt.getTime() - b.startsAt.getTime();

/** Ocupa a agenda (entra nas faixas e no calendário). */
const ocupa = (a: AgendaAppointment) => a.status !== "rejected" && a.status !== "cancelled" && a.status !== "no_show";

const jaRespondido = () => new DomainError("Este pedido já foi respondido.", "VALIDATION");

/**
 * Agenda do profissional e da barbearia (aba Trabalho): pedidos para aprovar, recusar ou sugerir
 * outro horário, a linha do tempo do dia e o atendimento (iniciar, finalizar, não
 * compareceu, cancelar).
 */
export class AgendaUseCases implements IAgendaUseCases {
  constructor(
    private readonly agenda: IAgendaDataSource,
    private readonly barbershops: IBarbershopDataSource,
    private readonly professionals: IProfessionalDataSource,
  ) {}

  private async barbeariaDa(scope: AgendaScope): Promise<string> {
    if (scope.kind === "barbershop") return scope.barbershopId;
    return scope.barbershopId ?? (await this.professionals.getMe()).barbershopId;
  }

  async getOverview(scope: AgendaScope, date: string, now: Date = new Date()): Promise<AgendaOverview> {
    const barbershopId = await this.barbeariaDa(scope);
    const [todos, horarios] = await Promise.all([
      this.agenda.list(scope),
      this.barbershops.listBusinessHours(barbershopId).catch(() => []),
    ]);

    const requests = todos
      .filter((a) => (a.status === "pending" || a.status === "awaiting_client") && a.endsAt.getTime() > now.getTime())
      .sort(porHorario);
    const doDia = todos.filter((a) => a.status !== "rejected" && isoDoDia(a.startsAt) === date).sort(porHorario);

    const funcionamento = horarios.find((h) => h.dayOfWeek === naData(date, "00:00").getDay());
    const day: AgendaEntry[] = [];
    // Faixas livres só fazem sentido para um profissional (na barbearia são vários ao mesmo tempo).
    let livreDesde = scope.kind === "professional" && funcionamento ? naData(date, funcionamento.openTime) : null;
    const livre = (ate: Date) => {
      if (livreDesde && ate.getTime() - livreDesde.getTime() >= MENOR_FAIXA_LIVRE_MIN * 60000) {
        day.push({ kind: "free", startsAt: livreDesde, endsAt: ate });
      }
    };
    for (const appointment of doDia) {
      if (ocupa(appointment)) livre(appointment.startsAt);
      day.push({ kind: "appointment", appointment });
      if (ocupa(appointment) && livreDesde && appointment.endsAt > livreDesde) livreDesde = appointment.endsAt;
    }
    if (funcionamento) livre(naData(date, funcionamento.closeTime));
    // Cancelados e faltas não ocupam a agenda: a faixa livre que os cobre volta para o lugar dela.
    const inicio = (e: AgendaEntry) => (e.kind === "free" ? e.startsAt : e.appointment.startsAt).getTime();
    day.sort((a, b) => inicio(a) - inicio(b));

    return {
      requests,
      closed: !funcionamento,
      day,
      markedDays: [...new Set(todos.filter(ocupa).map((a) => isoDoDia(a.startsAt)))].sort(),
    };
  }

  async listWorkplaces(): Promise<AgendaWorkplace[]> {
    const vinculos = await this.professionals.listMyWorkplaces();
    return Promise.all(
      vinculos.map(async (v) => ({
        barbershopId: v.barbershopId,
        name: (await this.barbershops.getBarbershop(v.barbershopId).catch(() => null))?.name ?? "Barbearia",
      })),
    );
  }

  async approve(appointment: AgendaAppointment, now: Date = new Date()): Promise<void> {
    if (appointment.status !== "pending") throw jaRespondido();
    if (appointment.endsAt.getTime() <= now.getTime()) {
      throw new DomainError("Esse horário já passou. Recuse o pedido ou sugira outro horário.", "VALIDATION");
    }
    await this.agenda.approve(appointment.id);
  }

  async reject(appointment: AgendaAppointment, reason?: string): Promise<void> {
    if (appointment.status !== "pending") throw jaRespondido();
    const motivo = reason?.trim() ?? "";
    if (motivo.length > MOTIVO_MAX) throw new ValidationError({ reason: `Use no máximo ${MOTIVO_MAX} caracteres.` });
    await this.agenda.reject(appointment.id, motivo || undefined);
  }

  async getAvailableSlots(appointment: AgendaAppointment, date: string, now: Date = new Date()): Promise<string[]> {
    const slots = await this.agenda.listAvailableSlots(
      appointment.barbershopId,
      appointment.professionalId,
      appointment.serviceId,
      date,
    );
    return slots.filter((hora) => naData(date, hora).getTime() > now.getTime()).sort();
  }

  async propose(appointment: AgendaAppointment, date: string, time: string | null, now: Date = new Date()): Promise<void> {
    if (appointment.status !== "pending") throw jaRespondido();
    const erros: Partial<Record<"date" | "time", string>> = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < isoDoDia(now)) erros.date = "Escolha um dia de hoje em diante.";
    if (!time) erros.time = "Escolha o horário que vai sugerir.";
    else if (naData(date, time).getTime() <= now.getTime()) erros.time = "Esse horário já passou.";
    else if (naData(date, time).getTime() === appointment.startsAt.getTime()) erros.time = "Escolha um horário diferente do pedido.";
    if (!time || Object.keys(erros).length > 0) throw new ValidationError(erros);
    await this.agenda.propose(appointment.id, date, time);
  }

  async start(appointment: AgendaAppointment, now: Date = new Date()): Promise<void> {
    if (appointment.status !== "confirmed") throw new DomainError("Só dá para iniciar um horário confirmado.", "VALIDATION");
    if (appointment.startsAt.getTime() - INICIO_ANTECIPADO_MIN * 60000 > now.getTime()) {
      throw new DomainError(`Dá para iniciar a partir de ${INICIO_ANTECIPADO_MIN} minutos antes do horário.`, "VALIDATION");
    }
    await this.agenda.start(appointment.id);
  }

  async complete(appointment: AgendaAppointment, now: Date = new Date()): Promise<void> {
    if (appointment.status === "in_progress") return this.agenda.complete(appointment.id);
    if (appointment.status !== "confirmed") {
      throw new DomainError("Só dá para finalizar um atendimento em andamento.", "VALIDATION");
    }
    if (appointment.startsAt.getTime() > now.getTime()) throw new DomainError("O atendimento ainda não começou.", "VALIDATION");
    await this.agenda.complete(appointment.id);
  }

  async noShow(appointment: AgendaAppointment, now: Date = new Date()): Promise<void> {
    if (appointment.status !== "confirmed") throw new DomainError("Só vale para um horário confirmado.", "VALIDATION");
    if (appointment.startsAt.getTime() > now.getTime()) throw new DomainError("O horário ainda não chegou.", "VALIDATION");
    await this.agenda.noShow(appointment.id);
  }

  async cancel(appointment: AgendaAppointment): Promise<void> {
    if (appointment.status !== "pending" && appointment.status !== "awaiting_client" && appointment.status !== "confirmed") {
      throw new DomainError("Esse horário não pode mais ser cancelado.", "VALIDATION");
    }
    await this.agenda.cancel(appointment.id);
  }
}
