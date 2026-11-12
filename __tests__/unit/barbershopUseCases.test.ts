import { describe, expect, it, jest } from "@jest/globals";

import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";
import { BarbershopUseCases, normalizeSearch } from "@/usecase/barbershopUseCases";

const barbearia = (id: string, name: string, address = "Rua A, 10"): Barbershop => ({
  id,
  name,
  address,
  phone: "86999990000",
  avatarUrl: null,
});

const profissional = (id: string, barbershopId: string, name: string, specialty: string | null): Professional => ({
  id,
  barbershopId,
  name,
  email: `${id}@mail.com`,
  phone: "86988880000",
  specialty,
  avatarUrl: null,
});

const servico = (id: string, barbershopId: string, name: string, price: number): Service => ({
  id,
  barbershopId,
  name,
  description: null,
  durationMinutes: 30,
  price,
  imageUrl: null,
});

const BARBEARIAS = [barbearia("b2", "Navalha de Ouro", "Av. Frei Serafim, 200"), barbearia("b1", "Barbearia Central")];
const PROFISSIONAIS: Record<string, Professional[]> = {
  b1: [profissional("p2", "b1", "Zé Tesoura", "Degradê"), profissional("p1", "b1", "André Lima", "Barba")],
  b2: [profissional("p3", "b2", "Ícaro Souza", null)],
};
const SERVICOS = [servico("s2", "b1", "Combo", 70), servico("s1", "b1", "Corte", 40)];

const fonteFalsa = (): jest.Mocked<IBarbershopDataSource> => ({
  listBarbershops: jest.fn(async () => BARBEARIAS),
  getBarbershop: jest.fn(async (id: string) => BARBEARIAS.find((b) => b.id === id)!),
  listProfessionals: jest.fn(async (id: string) => PROFISSIONAIS[id] ?? []),
  getProfessional: jest.fn(async (b: string, p: string) => PROFISSIONAIS[b]!.find((x) => x.id === p)!),
  listServices: jest.fn(async () => SERVICOS),
});

describe("BarbershopUseCases", () => {
  it("normaliza a busca ignorando acentos, caixa e espaços", () => {
    expect(normalizeSearch("  ÍCARO   Souza ")).toBe("icaro souza");
  });

  it("lista barbearias em ordem alfabética e filtra por nome ou endereço", async () => {
    const casos = new BarbershopUseCases(fonteFalsa());
    expect((await casos.listBarbershops()).map((b) => b.name)).toEqual(["Barbearia Central", "Navalha de Ouro"]);
    expect((await casos.listBarbershops("frei serafim")).map((b) => b.id)).toEqual(["b2"]);
    expect(await casos.listBarbershops("nada disso")).toEqual([]);
  });

  it("detalhe traz serviços do mais barato ao mais caro e barbeiros em ordem", async () => {
    const detalhe = await new BarbershopUseCases(fonteFalsa()).getBarbershopDetail("b1");
    expect(detalhe.barbershop.name).toBe("Barbearia Central");
    expect(detalhe.services.map((s) => s.name)).toEqual(["Corte", "Combo"]);
    expect(detalhe.professionals.map((p) => p.name)).toEqual(["André Lima", "Zé Tesoura"]);
  });

  it("lista barbeiros de todas as barbearias e filtra por especialidade ou barbearia", async () => {
    const casos = new BarbershopUseCases(fonteFalsa());
    const todos = await casos.listBarbers();
    expect(todos.map((b) => b.professional.name)).toEqual(["André Lima", "Ícaro Souza", "Zé Tesoura"]);
    expect(todos[1]!.barbershop.name).toBe("Navalha de Ouro");
    expect((await casos.listBarbers("degrade")).map((b) => b.professional.id)).toEqual(["p2"]);
    expect((await casos.listBarbers("navalha")).map((b) => b.professional.id)).toEqual(["p3"]);
  });

  it("perfil do barbeiro junta barbeiro, barbearia e serviços", async () => {
    const fonte = fonteFalsa();
    const perfil = await new BarbershopUseCases(fonte).getBarberProfile("b1", "p2");
    expect(perfil.professional.name).toBe("Zé Tesoura");
    expect(perfil.barbershop.id).toBe("b1");
    expect(perfil.services[0]!.price).toBe(40);
    expect(fonte.getProfessional).toHaveBeenCalledWith("b1", "p2");
  });

  it("repassa o erro da fonte de dados", async () => {
    const fonte = fonteFalsa();
    fonte.listBarbershops.mockRejectedValueOnce(new Error("falhou"));
    await expect(new BarbershopUseCases(fonte).listBarbershops()).rejects.toThrow("falhou");
  });
});
