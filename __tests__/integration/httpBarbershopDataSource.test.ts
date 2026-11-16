import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { HttpBarbershopDataSource } from "@/infra/datasources/httpBarbershopDataSource";
import { HttpClient } from "@/infra/http/httpClient";
import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import { DomainError } from "@/model/errors";

const resposta = (corpo: unknown, status = 200) =>
  ({ status, ok: status >= 200 && status < 300, json: async () => corpo }) as unknown as Response;

const montar = (token: string | null = "jwt-teste") => {
  const sessao = new MemoryAuthSessionService();
  sessao.setToken(token);
  return new HttpBarbershopDataSource(new HttpClient(sessao, "http://api.teste/api/v1"));
};

type Init = { headers: Record<string, string | undefined> };
let fetchMock: jest.Mock<(url: string, init: Init) => Promise<Response>>;
beforeEach(() => {
  fetchMock = jest.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe("HttpBarbershopDataSource", () => {
  it("envia o token e converte barbearias", async () => {
    fetchMock.mockResolvedValue(
      resposta([{ id: "b1", name: "Central", address: "Rua A", phone: "1", ownerId: "o", createdAt: "", updatedAt: "" }]),
    );
    const lista = await montar().listBarbershops();
    expect(lista).toEqual([{ id: "b1", name: "Central", address: "Rua A", phone: "1", avatarUrl: null }]);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.teste/api/v1/barbershops");
    expect(init.headers.Authorization).toBe("Bearer jwt-teste");
  });

  it("converte profissional usando os dados do usuário e serviço com preço numérico", async () => {
    fetchMock
      .mockResolvedValueOnce(
        resposta({
          id: "p1",
          barbershopId: "b1",
          specialty: "Degradê",
          avatarUrl: null,
          createdAt: "",
          usuario: { id: "u1", name: "Zé", email: "ze@mail.com", phone: "9", role: "professional", avatarUrl: "https://x/a.png" },
        }),
      )
      .mockResolvedValueOnce(
        resposta([{ id: "s1", barbershopId: "b1", name: "Corte", description: null, durationMinutes: 30, price: "45.5", createdAt: "" }]),
      );
    const fonte = montar();
    expect(await fonte.getProfessional("b1", "p 1")).toMatchObject({ name: "Zé", avatarUrl: "https://x/a.png", specialty: "Degradê" });
    expect(fetchMock.mock.calls[0]![0]).toBe("http://api.teste/api/v1/barbershops/b1/professionals/p%201");
    expect((await fonte.listServices("b1"))[0]!.price).toBe(45.5);
  });

  it.each([
    [401, "UNAUTHORIZED"],
    [404, "NOT_FOUND"],
    [500, "SERVER"],
  ])("status %i vira DomainError %s", async (status, code) => {
    fetchMock.mockResolvedValue(resposta({ error: "X", message: "Barbearia não encontrada." }, status));
    await expect(montar().getBarbershop("b9")).rejects.toMatchObject({ code });
  });

  it("sem token não manda Authorization; falha de rede vira NETWORK", async () => {
    fetchMock.mockRejectedValue(new TypeError("Network request failed"));
    const erro = await montar(null).listBarbershops().catch((e: unknown) => e);
    expect(erro).toBeInstanceOf(DomainError);
    expect((erro as DomainError).code).toBe("NETWORK");
    expect(fetchMock.mock.calls[0]![1].headers.Authorization).toBeUndefined();
  });

  it("resposta que não é lista vira INVALID_DATA", async () => {
    fetchMock.mockResolvedValue(resposta({ data: [] }));
    await expect(montar().listBarbershops()).rejects.toMatchObject({ code: "INVALID_DATA" });
  });
});
