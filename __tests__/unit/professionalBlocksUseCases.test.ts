import { describe, expect, it, jest } from "@jest/globals";

import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { AgendaAppointmentData, IProfessionalDataSource } from "@/model/datasources/iProfessionalDataSource";
import { ValidationError } from "@/model/errors";
import { ProfessionalUseCases } from "@/usecase/professionalUseCases";

const ag = (id: string, ini: [number, number], fim: [number, number], status: AgendaAppointmentData["status"] = "confirmed"): AgendaAppointmentData => ({
  id,
  serviceId: "s1",
  startsAt: new Date(2026, 10, 16, ...ini),
  endsAt: new Date(2026, 10, 16, ...fim),
  status,
});

const montar = (agenda: AgendaAppointmentData[] = []) => {
  const pro = {
    getMe: jest.fn(async () => ({ professionalId: "p1", barbershopId: "b1" })),
    listMyAgenda: jest.fn(async () => agenda),
    listUnavailabilities: jest.fn(async () => []),
    addUnavailability: jest.fn(async () => undefined),
    removeUnavailability: jest.fn(async () => undefined),
    listRecurringUnavailabilities: jest.fn(async () => []),
    addRecurringUnavailability: jest.fn(async () => undefined),
    removeRecurringUnavailability: jest.fn(async () => undefined),
  } as jest.Mocked<IProfessionalDataSource>;
  const barbearias = {
    listServices: jest.fn(async () => [{ id: "s1", barbershopId: "b1", name: "Corte", description: null, durationMinutes: 30, price: 40, imageUrl: null }]),
    listBusinessHours: jest.fn(async () => [{ dayOfWeek: 1, openTime: "09:00", closeTime: "12:00" }]),
  } as unknown as jest.Mocked<IBarbershopDataSource>;
  const sessao = new MemoryAuthSessionService();
  sessao.setSession({ token: "t", roles: ["profissional"], user: { id: "u1", name: "Zé", email: "", phone: "", avatarUrl: null, memberSince: new Date() } });
  return { pro, barbearias, sessao, casos: new ProfessionalUseCases(pro, barbearias, sessao) };
};

describe("ProfessionalUseCases (bloqueios)", () => {
  it("recorrente sem motivo envia undefined e recusa formato de hora inválido", async () => {
    const { pro, casos } = montar();
    const erro = await casos.addRecurringBlock({ days: [1], startTime: "25:00", endTime: "13:00", reason: " " }).catch((e: unknown) => e);
    expect((erro as ValidationError).fields).toEqual({ startTime: "Use o formato HH:mm." });

    await casos.addRecurringBlock({ days: [2], startTime: "12:00", endTime: "13:00", reason: "   " });
    expect(pro.addRecurringUnavailability).toHaveBeenCalledWith(expect.anything(), 2, "12:00", "13:00", undefined);
  });

  it("pontual recusa horário final antes do inicial", async () => {
    const { casos } = montar();
    const erro = await casos
      .addOneOffBlock({ date: "2026-11-20", startTime: "16:00", endTime: "14:00", reason: "" }, new Date(2026, 10, 16, 10))
      .catch((e: unknown) => e);
    expect((erro as ValidationError).fields).toEqual({ endTime: "O horário final precisa ser depois do inicial." });
  });

  it("agrupa recorrentes por horário e motivo, com domingo por último", async () => {
    const { pro, casos } = montar();
    pro.listRecurringUnavailabilities.mockResolvedValueOnce([
      { id: "a", dayOfWeek: 0, startTime: "12:00", endTime: "13:00", reason: "Almoço" },
      { id: "b", dayOfWeek: 6, startTime: "12:00", endTime: "13:00", reason: "Almoço" },
      { id: "c", dayOfWeek: 3, startTime: "15:00", endTime: "16:00", reason: "Curso" },
    ]);
    const { recurring } = await casos.listMyBlocks(new Date(2026, 10, 16));
    expect(recurring.map((g) => [g.startTime, g.days])).toEqual([
      ["12:00", [6, 0]],
      ["15:00", [3]],
    ]);
  });

  it("falha ao buscar a identidade não fica em cache", async () => {
    const { pro, casos } = montar();
    pro.getMe.mockRejectedValueOnce(new Error("offline"));
    await expect(casos.listMyBlocks()).rejects.toThrow("offline");
    await casos.listMyBlocks();
    expect(pro.getMe).toHaveBeenCalledTimes(2);
  });

  it("agenda do dia segue quando serviços e horários falham", async () => {
    const { barbearias, casos } = montar([ag("a1", [9, 0], [9, 30])]);
    barbearias.listServices.mockRejectedValueOnce(new Error("serviços fora"));
    barbearias.listBusinessHours.mockRejectedValueOnce(new Error("horários fora"));
    const { closed, items } = await casos.getDayAgenda("2026-11-16");
    expect(closed).toBe(true);
    expect(items.map((i) => i.kind)).toEqual(["appointment"]);
  });
});
