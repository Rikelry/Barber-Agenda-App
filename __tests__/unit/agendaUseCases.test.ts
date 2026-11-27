import { describe, expect, it, jest } from "@jest/globals";

import type { IAgendaDataSource } from "@/model/datasources/iAgendaDataSource";
import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { IProfessionalDataSource } from "@/model/datasources/iProfessionalDataSource";
import type { AgendaAppointment } from "@/model/entities/agendaAppointment";
import { DomainError, ValidationError } from "@/model/errors";
import { AgendaUseCases } from "@/usecase/agendaUseCases";

/** Segunda, 16/11/2026, 10:00. */
const AGORA = new Date(2026, 10, 16, 10, 0);

const horario = (id: string, status: AgendaAppointment["status"], dia: number, hora: number, min = 0): AgendaAppointment => {
  const startsAt = new Date(2026, 10, dia, hora, min);
  return {
    id,
    barbershopId: "b1",
    professionalId: "p1",
    professionalName: "Alessandro",
    clientName: "João",
    clientPhone: "",
    serviceId: "s1",
    serviceName: "Corte",
    durationMinutes: 30,
    startsAt,
    endsAt: new Date(startsAt.getTime() + 30 * 60000),
    status,
    proposal: null,
    rejectionReason: null,
  };
};

const montar = (lista: AgendaAppointment[]) => {
  const agenda: jest.Mocked<IAgendaDataSource> = {
    list: jest.fn(async () => lista),
    approve: jest.fn(async () => undefined),
    reject: jest.fn(async () => undefined),
    propose: jest.fn(async () => undefined),
    start: jest.fn(async () => undefined),
    complete: jest.fn(async () => undefined),
    noShow: jest.fn(async () => undefined),
    cancel: jest.fn(async () => undefined),
    reschedule: jest.fn(async () => undefined),
    listAvailableSlots: jest.fn(async () => ["09:00", "10:30", "14:00"]),
  };
  const barbearias = {
    listBusinessHours: jest.fn(async () => [{ dayOfWeek: 1, openTime: "09:00", closeTime: "18:00" }]),
    getBarbershop: jest.fn(async () => ({ id: "b1", name: "Don Corleone" })),
  } as unknown as IBarbershopDataSource;
  const profissionais = {
    getMe: jest.fn(async () => ({ professionalId: "p1", barbershopId: "b1" })),
    listMyWorkplaces: jest.fn(async () => [{ professionalId: "p1", barbershopId: "b1" }]),
  } as unknown as IProfessionalDataSource;
  return { agenda, casos: new AgendaUseCases(agenda, barbearias, profissionais) };
};

describe("AgendaUseCases", () => {
  it("separa os pedidos futuros e monta o dia com as faixas livres", async () => {
    const { casos } = montar([
      horario("passado", "pending", 16, 8),
      horario("pedido", "pending", 17, 11),
      horario("marcado", "confirmed", 16, 12),
      horario("pedido-hoje", "pending", 16, 15),
      horario("recusado", "rejected", 16, 13),
    ]);
    const visao = await casos.getOverview({ kind: "professional" }, "2026-11-16", AGORA);
    expect(visao.requests.map((r) => r.id)).toEqual(["pedido-hoje", "pedido"]);
    expect(visao.markedDays).toEqual(["2026-11-16", "2026-11-17"]);
    expect(visao.closed).toBe(false);
    // O pedido das 8h (que já passou) continua no dia; as faixas livres ficam entre os horários.
    expect(visao.day.map((e) => (e.kind === "free" ? "livre" : e.appointment.id))).toEqual([
      "passado",
      "livre",
      "marcado",
      "livre",
      "pedido-hoje",
      "livre",
    ]);
  });

  it("na barbearia não mostra faixas livres", async () => {
    const { casos } = montar([horario("marcado", "confirmed", 16, 12)]);
    const visao = await casos.getOverview({ kind: "barbershop", barbershopId: "b1" }, "2026-11-16", AGORA);
    expect(visao.day.every((e) => e.kind === "appointment")).toBe(true);
  });

  it("aprova e recusa só pedidos pendentes; não aprova horário que já passou", async () => {
    const { agenda, casos } = montar([]);
    await casos.approve(horario("a", "pending", 17, 11), AGORA);
    expect(agenda.approve).toHaveBeenCalledWith("a");
    await expect(casos.approve(horario("b", "confirmed", 17, 11), AGORA)).rejects.toBeInstanceOf(DomainError);
    await expect(casos.approve(horario("c", "pending", 16, 8), AGORA)).rejects.toBeInstanceOf(DomainError);
    await casos.reject(horario("d", "pending", 16, 8), "  Agenda cheia ");
    expect(agenda.reject).toHaveBeenCalledWith("d", "Agenda cheia");
    await casos.reject(horario("e", "pending", 16, 8));
    expect(agenda.reject).toHaveBeenLastCalledWith("e", undefined);
    await expect(casos.reject(horario("f", "pending", 16, 8), "x".repeat(201))).rejects.toBeInstanceOf(ValidationError);
  });

  it("inicia confirmados a partir de 15 min antes; não compareceu só depois do horário", async () => {
    const { agenda, casos } = montar([]);
    await expect(casos.start(horario("a", "confirmed", 16, 10, 30), AGORA)).rejects.toBeInstanceOf(DomainError);
    await casos.start(horario("b", "confirmed", 16, 10, 10), AGORA);
    expect(agenda.start).toHaveBeenCalledWith("b");
    await expect(casos.start(horario("c", "pending", 16, 10), AGORA)).rejects.toBeInstanceOf(DomainError);
    await expect(casos.noShow(horario("d", "confirmed", 16, 11), AGORA)).rejects.toBeInstanceOf(DomainError);
    await casos.noShow(horario("e", "confirmed", 16, 9), AGORA);
    expect(agenda.noShow).toHaveBeenCalledWith("e");
  });

  it("cancela pendentes, aguardando cliente e confirmados", async () => {
    const { agenda, casos } = montar([]);
    await casos.cancel(horario("a", "awaiting_client", 17, 11));
    expect(agenda.cancel).toHaveBeenCalledWith("a");
    await expect(casos.cancel(horario("b", "in_progress", 16, 9))).rejects.toBeInstanceOf(DomainError);
  });

  it("lista as barbearias onde o profissional atende, com o nome", async () => {
    const { casos } = montar([]);
    expect(await casos.listWorkplaces()).toEqual([{ barbershopId: "b1", name: "Don Corleone" }]);
  });

  it("finaliza em andamento ou confirmados que já começaram", async () => {
    const { agenda, casos } = montar([]);
    await expect(casos.complete(horario("a", "confirmed", 16, 11), AGORA)).rejects.toBeInstanceOf(DomainError);
    await casos.complete(horario("b", "confirmed", 16, 9, 45), AGORA);
    expect(agenda.complete).toHaveBeenCalledWith("b");
    await casos.complete(horario("c", "in_progress", 16, 9), AGORA);
    expect(agenda.complete).toHaveBeenLastCalledWith("c");
    await expect(casos.complete(horario("d", "completed", 16, 9), AGORA)).rejects.toBeInstanceOf(DomainError);
  });

  it("sugere outro horário só a pedidos pendentes, validando dia e horário", async () => {
    const { agenda, casos } = montar([]);
    const a = horario("a", "pending", 17, 11);
    expect(await casos.getAvailableSlots(a, "2026-11-16", AGORA)).toEqual(["10:30", "14:00"]);
    await expect(casos.propose(a, "2026-11-16", null, AGORA)).rejects.toBeInstanceOf(ValidationError);
    await expect(casos.propose(a, "2026-11-15", "10:00", AGORA)).rejects.toBeInstanceOf(ValidationError);
    await expect(casos.propose(a, "2026-11-17", "11:00", AGORA)).rejects.toBeInstanceOf(ValidationError);
    await casos.propose(a, "2026-11-18", "14:00", AGORA);
    expect(agenda.propose).toHaveBeenCalledWith("a", "2026-11-18", "14:00");
    await expect(casos.propose(horario("c", "confirmed", 17, 11), "2026-11-18", "14:00", AGORA)).rejects.toBeInstanceOf(DomainError);
  });
});
