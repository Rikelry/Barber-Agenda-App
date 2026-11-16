import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { HttpAppointmentDataSource } from "@/infra/datasources/httpAppointmentDataSource";
import { HttpClient } from "@/infra/http/httpClient";
import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";

type Init = { method: string; body?: string };
let fetchMock: jest.Mock<(url: string, init: Init) => Promise<Response>>;
const resposta = (corpo: unknown, status = 200) =>
  ({ status, ok: status >= 200 && status < 300, json: async () => corpo }) as unknown as Response;
const fonte = () => new HttpAppointmentDataSource(new HttpClient(new MemoryAuthSessionService(), "http://api.teste/api/v1"));

const DTO = {
  id: "a1",
  barbershopId: "b1",
  status: "agendado",
  professional: { id: "p1", name: "Alessandro" },
  service: { id: "s1", name: "Combo", duration: 70 },
  date: "2026-11-17",
  startTime: "15:00",
  endTime: "16:10",
  createdAt: "",
};

beforeEach(() => {
  fetchMock = jest.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe("HttpAppointmentDataSource", () => {
  it("lista e converte status, datas e serviço", async () => {
    fetchMock.mockResolvedValue(resposta({ agendamentos: [DTO, { ...DTO, id: "a2", status: "cancelado" }] }));
    const [a, b] = await fonte().listMine();
    expect(a).toMatchObject({ status: "confirmed", serviceName: "Combo", durationMinutes: 70, professionalName: "Alessandro" });
    expect(a!.startsAt).toEqual(new Date(2026, 10, 17, 15, 0));
    expect(a!.endsAt).toEqual(new Date(2026, 10, 17, 16, 10));
    expect(b!.status).toBe("cancelled");
  });

  it("cria, cancela, reagenda e busca horários livres nas rotas certas", async () => {
    fetchMock.mockResolvedValue(resposta(DTO));
    const f = fonte();
    await f.create({ professionalId: "p1", serviceId: "s1", date: "2026-11-17", time: "15:00" });
    await f.cancel("a1");
    await f.reschedule("a1", "2026-11-18", "10:00");
    fetchMock.mockResolvedValueOnce(resposta({ slots: ["09:00:00", "09:30"] }));
    expect(await f.listAvailableSlots("b1", "p1", "s1", "2026-11-17")).toEqual(["09:00", "09:30"]);
    const chamadas = fetchMock.mock.calls.map(([url, init]) => `${init.method} ${url.replace("http://api.teste/api/v1", "")}`);
    expect(chamadas).toEqual([
      "POST /agendamentos",
      "PATCH /agendamentos/a1/cancelar",
      "PATCH /agendamentos/a1/reschedule",
      "GET /barbershops/b1/professionals/p1/available-slots?date=2026-11-17&serviceId=s1",
    ]);
  });
});
