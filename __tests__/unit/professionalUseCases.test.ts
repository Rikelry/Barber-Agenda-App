import { describe, expect, it, jest } from "@jest/globals";

import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { AgendaAppointmentData, IProfessionalDataSource } from "@/model/datasources/iProfessionalDataSource";
import { ValidationError } from "@/model/errors";
import { ProfessionalUseCases } from "@/usecase/professionalUseCases";

const ag = (id: string, ini: [number, number], fim: [number, number], status: AgendaAppointmentData["status"] = "confirmed", dia = 16): AgendaAppointmentData => ({
  id,
  serviceId: "s1",
  startsAt: new Date(2026, 10, dia, ...ini),
  endsAt: new Date(2026, 10, dia, ...fim),
  status,
});

const montar = (agenda: AgendaAppointmentData[]) => {
  const pro = {
    getMe: jest.fn(async () => ({ professionalId: "p1", barbershopId: "b1", specialty: "Degradê" })),
    listMyAgenda: jest.fn(async () => agenda),
    completeAppointment: jest.fn(async () => undefined),
    cancelAppointment: jest.fn(async () => undefined),
    listUnavailabilities: jest.fn(async () => [
      { id: "u-velho", startsAt: new Date(2026, 9, 1, 14), endsAt: new Date(2026, 9, 1, 16), reason: null },
      { id: "u1", startsAt: new Date(2026, 10, 20, 14), endsAt: new Date(2026, 10, 20, 16), reason: "Exame médico" },
    ]),
    addUnavailability: jest.fn(async () => undefined),
    removeUnavailability: jest.fn(async () => undefined),
    listRecurringUnavailabilities: jest.fn(async () =>
      [1, 2, 3, 4, 5].map((d) => ({ id: "r" + d, dayOfWeek: d, startTime: "12:00", endTime: "13:00", reason: "Almoço Diário" })),
    ),
    addRecurringUnavailability: jest.fn(async () => undefined),
    removeRecurringUnavailability: jest.fn(async () => undefined),
    listMyWorkplaces: jest.fn(async () => []),
  } as jest.Mocked<IProfessionalDataSource>;
  const barbearias = {
    listServices: jest.fn(async () => [{ id: "s1", barbershopId: "b1", name: "Corte Degradê", description: null, durationMinutes: 30, price: 40, imageUrl: null }]),
    listBusinessHours: jest.fn(async () => [{ dayOfWeek: 1, openTime: "09:00", closeTime: "12:00" }]),
    getBarbershop: jest.fn(async () => ({ id: "b1", name: "Don Corleone", address: "Rua A", phone: "11999990000", avatarUrl: null })),
  } as unknown as jest.Mocked<IBarbershopDataSource>;
  const sessao = new MemoryAuthSessionService();
  sessao.setSession({ token: "t", roles: ["profissional"], user: { id: "u1", name: "Zé", email: "", phone: "", avatarUrl: null, memberSince: new Date() } });
  return { pro, sessao, casos: new ProfessionalUseCases(pro, barbearias, sessao) };
};

describe("ProfessionalUseCases", () => {
  it("agenda do dia: agendamentos com o serviço e faixas livres de 30 min ou mais", async () => {
    const { casos } = montar([
      ag("a1", [9, 0], [9, 30]),
      ag("cancelado", [9, 30], [10, 0], "cancelled"),
      ag("a2", [10, 0], [11, 0], "completed"),
      ag("a3", [11, 40], [12, 0]),
      ag("outro-dia", [9, 0], [9, 30], "confirmed", 17),
    ]);
    const { closed, items } = await casos.getDayAgenda("2026-11-16");
    expect(closed).toBe(false);
    expect(items.map((i) => (i.kind === "free" ? `livre ${i.startsAt.getHours()}:${i.startsAt.getMinutes()}` : i.id))).toEqual([
      "a1",
      "livre 9:30",
      "a2",
      "livre 11:0",
      "a3",
    ]);
    expect(items[0]).toMatchObject({ serviceName: "Corte Degradê" });
    expect((await casos.getDayAgenda("2026-11-15")).closed).toBe(true);
  });

  it("bloqueios: recorrentes agrupados de segunda a sexta e só os pontuais futuros", async () => {
    const { casos } = montar([]);
    const { recurring, oneOff } = await casos.listMyBlocks(new Date(2026, 10, 16));
    expect(recurring).toEqual([
      { key: "12:00|13:00|Almoço Diário", ids: ["r1", "r2", "r3", "r4", "r5"], days: [1, 2, 3, 4, 5], startTime: "12:00", endTime: "13:00", reason: "Almoço Diário" },
    ]);
    expect(oneOff.map((u) => u.id)).toEqual(["u1"]);
  });

  it("cria um recorrente por dia, valida horários e remove o grupo inteiro", async () => {
    const { pro, casos } = montar([]);
    const erro = await casos.addRecurringBlock({ days: [], startTime: "13:00", endTime: "12:00", reason: "" }).catch((e: unknown) => e);
    expect((erro as ValidationError).fields).toEqual({ days: "Escolha pelo menos um dia.", endTime: "O horário final precisa ser depois do inicial." });
    await casos.addRecurringBlock({ days: [1, 3], startTime: "12:00", endTime: "13:00", reason: "Almoço" });
    expect(pro.addRecurringUnavailability.mock.calls.map((c) => c[1])).toEqual([1, 3]);
    const { recurring } = await casos.listMyBlocks(new Date(2026, 10, 16));
    await casos.removeRecurringBlock(recurring[0]!);
    expect(pro.removeRecurringUnavailability).toHaveBeenCalledTimes(5);
    expect(pro.getMe).toHaveBeenCalledTimes(1);
  });

  it("pontual não aceita data passada e envia início e fim na data escolhida", async () => {
    const { pro, casos } = montar([]);
    const hoje = new Date(2026, 10, 16, 10);
    const erro = await casos.addOneOffBlock({ date: "2026-11-15", startTime: "14:00", endTime: "16:00", reason: "" }, hoje).catch((e: unknown) => e);
    expect((erro as ValidationError).fields).toEqual({ date: "Escolha uma data a partir de hoje." });
    await casos.addOneOffBlock({ date: "2026-11-20", startTime: "14:00", endTime: "16:00", reason: "Exame" }, hoje);
    expect(pro.addUnavailability).toHaveBeenCalledWith(expect.anything(), new Date(2026, 10, 20, 14), new Date(2026, 10, 20, 16), "Exame");
  });

  it("troca de conta busca a identidade de novo", async () => {
    const { pro, sessao, casos } = montar([]);
    await casos.listMyBlocks();
    sessao.setSession({ token: "t2", roles: ["profissional"], user: { id: "u2", name: "Outro", email: "", phone: "", avatarUrl: null, memberSince: new Date() } });
    await casos.listMyBlocks();
    expect(pro.getMe).toHaveBeenCalledTimes(2);
  });

  it("local de trabalho: barbearia, especialidade e a semana de segunda a domingo", async () => {
    const { casos } = montar([]);
    const w = await casos.getWorkplace();
    expect(w.barbershop.name).toBe("Don Corleone");
    expect(w.specialty).toBe("Degradê");
    expect(w.week.map((d) => d.dayOfWeek)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(w.week[0]?.hours).toEqual({ openTime: "09:00", closeTime: "12:00" });
    expect(w.week[1]?.hours).toBeNull();
    expect(w.services[0]?.name).toBe("Corte Degradê");
  });

  it("concluir só depois do início; cancelar repassa", async () => {
    const { pro, casos } = montar([]);
    const agora = new Date(2026, 10, 16, 10);
    await expect(casos.completeAppointment("a1", new Date(2026, 10, 16, 11), agora)).rejects.toThrow(
      "Só dá para concluir depois do horário de início.",
    );
    await casos.completeAppointment("a1", new Date(2026, 10, 16, 9), agora);
    expect(pro.completeAppointment).toHaveBeenCalledWith("a1");
    await casos.cancelAppointment("a2");
    expect(pro.cancelAppointment).toHaveBeenCalledWith("a2");
  });
});
