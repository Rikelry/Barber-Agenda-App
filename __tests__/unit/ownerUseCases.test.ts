import { describe, expect, it, jest } from "@jest/globals";

import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { Address } from "@/model/entities/address";
import type { Barbershop } from "@/model/entities/barbershop";
import { ValidationError } from "@/model/errors";
import type { IImageStorageService } from "@/model/services/iImageStorageService";
import { OwnerUseCases, formatAddress, parseAddress } from "@/usecase/ownerUseCases";

const COMPLETO: Address = {
  cep: "01311000",
  street: "Av. Paulista",
  number: "1000",
  complement: "Sala 402",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "sp",
};

const barbearia = (id: string, ownerId: string, name: string): Barbershop => ({
  id,
  name,
  address: "Rua A, 1 - Centro",
  phone: "11999990000",
  avatarUrl: null,
  ownerId,
});

const montar = () => {
  const fonte = {
    listBarbershops: jest.fn(async () => [barbearia("b2", "u1", "Pinheiros"), barbearia("b1", "u1", "Matriz"), barbearia("b3", "outro", "Alheia")]),
    listBusinessHours: jest.fn(async (id: string) => (id === "b1" ? [{ dayOfWeek: 1, openTime: "09:00", closeTime: "20:00" }] : [])),
    createBarbershop: jest.fn(async (d: { name: string }) => ({ ...barbearia("nova", "u1", d.name) })),
    updateBarbershop: jest.fn(async (id: string, d: object) => ({ ...barbearia(id, "u1", "x"), ...d })),
    getBarbershop: jest.fn(async () => ({ ...barbearia("b1", "u1", "Matriz"), address: formatAddress(COMPLETO) })),
    saveBusinessHours: jest.fn(async () => undefined),
    createProfessional: jest.fn(async () => ({})),
    createService: jest.fn(async () => ({ id: "s9" })),
    updateService: jest.fn(async () => ({})),
  } as unknown as jest.Mocked<IBarbershopDataSource>;
  const imagens: jest.Mocked<IImageStorageService> = { upload: jest.fn(async () => "https://cdn/logo.png") };
  const sessao = new MemoryAuthSessionService();
  sessao.setSession({
    token: "t",
    roles: ["owner"],
    user: { id: "u1", name: "Dono", email: "d@mail.com", phone: "1", avatarUrl: null, memberSince: new Date() },
  });
  return { fonte, imagens, casos: new OwnerUseCases(fonte, imagens, sessao) };
};

const campos = async (p: Promise<unknown>) => ((await p.catch((e: unknown) => e)) as ValidationError).fields;

describe("endereço", () => {
  it("monta e separa o texto único da API sem perder partes", () => {
    const texto = formatAddress(COMPLETO);
    expect(texto).toBe("Av. Paulista, 1000 - Sala 402 - Bela Vista, São Paulo - SP, CEP 01311-000");
    expect(parseAddress(texto)).toEqual({ ...COMPLETO, cep: "01311-000", state: "SP" });
    const simples = { ...COMPLETO, complement: "", city: "", state: "", cep: "" };
    expect(parseAddress(formatAddress(simples))).toEqual(simples);
  });

  it("endereço em formato desconhecido vai inteiro para a rua", () => {
    expect(parseAddress("Perto da praça").street).toBe("Perto da praça");
  });
});

describe("OwnerUseCases", () => {
  it("lista só as barbearias do dono, em ordem, com aberta/fechada agora", async () => {
    const { casos } = montar();
    const segunda10h = new Date(2026, 10, 16, 10);
    const lista = await casos.listMyBarbershops("", segunda10h);
    expect(lista.map((b) => [b.barbershop.name, b.openNow])).toEqual([
      ["Matriz", true],
      ["Pinheiros", false],
    ]);
    expect((await casos.listMyBarbershops("pinh", segunda10h)).map((b) => b.barbershop.id)).toEqual(["b2"]);
  });

  it("cria com endereço montado, envia o logo e grava a URL", async () => {
    const { fonte, imagens, casos } = montar();
    expect(await campos(casos.createBarbershop({ name: "B", phone: "1", ...COMPLETO, cep: "123", street: "", number: "", neighborhood: "" }))).toEqual({
      name: "Informe o nome da barbearia.",
      phone: "Informe o telefone com DDD.",
      cep: "O CEP tem 8 números.",
      street: "Informe a rua.",
      number: "Informe o número.",
      neighborhood: "Informe o bairro.",
    });
    const logo = { uri: "file:///logo.jpg", name: "logo.jpg", mimeType: "image/jpeg" };
    await casos.createBarbershop({ name: "Barbearia Estilo", phone: "(11) 3444-4444", ...COMPLETO }, logo);
    expect(fonte.createBarbershop).toHaveBeenCalledWith({
      name: "Barbearia Estilo",
      phone: "1134444444",
      address: "Av. Paulista, 1000 - Sala 402 - Bela Vista, São Paulo - SP, CEP 01311-000",
    });
    expect(imagens.upload).toHaveBeenCalledWith(logo, "barbershops", "nova");
    expect(fonte.updateBarbershop).toHaveBeenCalledWith("nova", { avatarUrl: "https://cdn/logo.png" });
  });

  it("horários: semana de segunda a domingo, valida e envia só os dias abertos", async () => {
    const { fonte, casos } = montar();
    const semana = await casos.getWeekHours("b1");
    expect(semana.map((d) => d.dayOfWeek)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(semana[0]).toEqual({ dayOfWeek: 1, open: true, openTime: "09:00", closeTime: "20:00" });
    expect(semana[6]?.open).toBe(false);

    const errada = semana.map((d) => (d.dayOfWeek === 1 ? { ...d, closeTime: "08:00" } : d));
    expect(await campos(casos.saveWeekHours("b1", errada))).toEqual({ "1": "O fechamento precisa ser depois da abertura." });

    const aberta = semana.map((d) => (d.dayOfWeek === 2 ? { ...d, open: true } : d));
    await casos.saveWeekHours("b1", aberta);
    expect(fonte.saveBusinessHours.mock.calls.map((c) => c[1].dayOfWeek)).toEqual([1, 2]);
  });

  it("profissional novo exige e-mail e senha; serviço valida duração e preço", async () => {
    const { fonte, casos } = montar();
    expect(await campos(casos.addProfessional("b1", { name: "Lu", phone: "11", email: "x", password: "1", specialty: "" }))).toEqual({
      name: "Informe o nome completo.",
      phone: "Informe o celular com DDD.",
      email: "Informe um e-mail válido.",
      password: "A senha precisa de pelo menos 8 caracteres.",
    });
    await casos.addProfessional("b1", { name: "Lucas Silva", phone: "(11) 99999-9999", email: "L@Mail.com", password: "senha1234", specialty: "Barba" });
    expect(fonte.createProfessional).toHaveBeenCalledWith("b1", {
      name: "Lucas Silva",
      phone: "11999999999",
      email: "l@mail.com",
      password: "senha1234",
      specialty: "Barba",
    });
    expect(await campos(casos.addService("b1", { name: "", description: "", durationMinutes: "2", price: "" }))).toEqual({
      name: "Informe o nome do serviço.",
      durationMinutes: "Duração em minutos, de 5 a 480.",
      price: "Informe o preço.",
    });
    await casos.addService("b1", { name: "Corte", description: "", durationMinutes: "40", price: "50,90" });
    expect(fonte.createService).toHaveBeenCalledWith("b1", { name: "Corte", durationMinutes: 40, price: 50.9 });
    await casos.addService("b1", { name: "Barba", description: "", durationMinutes: "30", price: "35" }, { uri: "file:///b.jpg", name: "b.jpg", mimeType: "image/jpeg" });
    expect(fonte.updateService).toHaveBeenLastCalledWith("b1", "s9", { imageUrl: "https://cdn/logo.png" });
  });
});
