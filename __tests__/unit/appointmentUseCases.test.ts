import { describe, expect, it, jest } from "@jest/globals";

import type { AppointmentData, IAppointmentDataSource } from "@/model/datasources/iAppointmentDataSource";
import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import { ValidationError } from "@/model/errors";
import { AppointmentUseCases, toDateTime, toIsoDate } from "@/usecase/appointmentUseCases";

const AGORA = new Date(2026, 10, 16, 10, 0);

const agendamento = (id: string, startsAt: Date, status: AppointmentData["status"], barbershopId = "b1"): AppointmentData => ({
  id,
  barbershopId,
  professionalId: "p1",
  professionalName: "Alessandro",
  serviceId: "s1",
  serviceName: "Corte",
  durationMinutes: 40,
  startsAt,
  endsAt: startsAt,
  status,
});

const montar = (lista: AppointmentData[]) => {
  const agendamentos: jest.Mocked<IAppointmentDataSource> = {
    listMine: jest.fn(async () => lista),
    create: jest.fn(async (r) => agendamento("novo", toDateTime(r.date, r.time), "confirmed")),
    cancel: jest.fn(async () => undefined),
    reschedule: jest.fn(async (id, date, time) => agendamento(id, toDateTime(date, time), "confirmed")),
    listAvailableSlots: jest.fn(async () => ["15:00", "09:00", "10:30"]),
  };
  const barbearias = {
    getBarbershop: jest.fn(async (id: string) => ({ id, name: id === "b1" ? "Don Corleone" : "Vintage", address: "", phone: "", avatarUrl: null })),
  } as unknown as jest.Mocked<IBarbershopDataSource>;
  return { agendamentos, barbearias, casos: new AppointmentUseCases(agendamentos, barbearias) };
};

describe("AppointmentUseCases", () => {
  it("separa próximos e histórico e põe o nome da barbearia (buscando cada uma uma vez)", async () => {
    const { barbearias, casos } = montar([
      agendamento("passado", new Date(2026, 10, 10, 9), "completed"),
      agendamento("cancelado", new Date(2026, 10, 20, 9), "cancelled", "b2"),
      agendamento("depois", new Date(2026, 10, 22, 9), "confirmed", "b2"),
      agendamento("proximo", new Date(2026, 10, 17, 15), "confirmed"),
    ]);
    const { upcoming, history } = await casos.listMyAppointments(AGORA);
    expect(upcoming.map((a) => a.id)).toEqual(["proximo", "depois"]);
    expect(history.map((a) => a.id)).toEqual(["cancelado", "passado"]);
    expect(upcoming[1]!.barbershopName).toBe("Vintage");
    expect(barbearias.getBarbershop).toHaveBeenCalledTimes(2);
    expect((await casos.getNextAppointment(AGORA))?.id).toBe("proximo");
  });

  it("horários de hoje só os que ainda não passaram, em ordem", async () => {
    const { casos } = montar([]);
    expect(await casos.getAvailableSlots("b1", "p1", "s1", toIsoDate(AGORA), AGORA)).toEqual(["10:30", "15:00"]);
    expect(await casos.getAvailableSlots("b1", "p1", "s1", "2026-11-17", AGORA)).toEqual(["09:00", "10:30", "15:00"]);
  });

  it("agendar valida profissional, data e horário antes de chamar a API", async () => {
    const { agendamentos, casos } = montar([]);
    const erro = await casos
      .book({ barbershopId: "b1", serviceId: "s1", professionalId: null, date: "2026-11-15", time: null }, AGORA)
      .catch((e: unknown) => e);
    expect((erro as ValidationError).fields).toEqual({
      professionalId: "Escolha o profissional.",
      date: "Escolha uma data a partir de hoje.",
      time: "Escolha um horário.",
    });
    expect(agendamentos.create).not.toHaveBeenCalled();

    const criado = await casos.book(
      { barbershopId: "b1", serviceId: "s1", professionalId: "p1", date: "2026-11-17", time: "15:00" },
      AGORA,
    );
    expect(agendamentos.create).toHaveBeenCalledWith({ professionalId: "p1", serviceId: "s1", date: "2026-11-17", time: "15:00" });
    expect(criado.barbershopName).toBe("Don Corleone");
  });

  it("reagendar mantém a barbearia e recusa horário que já passou; cancelar repassa", async () => {
    const { agendamentos, casos } = montar([]);
    const atual = { ...agendamento("a1", new Date(2026, 10, 17, 15), "confirmed"), barbershopName: "Don Corleone" };
    await expect(casos.reschedule(atual, toIsoDate(AGORA), "09:00", AGORA)).rejects.toBeInstanceOf(ValidationError);
    const novo = await casos.reschedule(atual, "2026-11-18", "11:00", AGORA);
    expect(agendamentos.reschedule).toHaveBeenCalledWith("a1", "2026-11-18", "11:00");
    expect(novo.barbershopName).toBe("Don Corleone");
    await casos.cancel("a1");
    expect(agendamentos.cancel).toHaveBeenCalledWith("a1");
  });

  it("sem agendamentos futuros, o próximo é nulo", async () => {
    const { casos } = montar([agendamento("passado", new Date(2026, 10, 10, 9), "completed")]);
    expect(await casos.getNextAppointment(AGORA)).toBeNull();
  });
});
