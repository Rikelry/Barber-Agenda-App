import { describe, expect, it } from "@jest/globals";

import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { Barbershop } from "@/model/entities/barbershop";
import type { BusinessHours } from "@/model/entities/businessHours";
import type { Service } from "@/model/entities/service";
import { categoriesOf, HomeUseCases, isOpenAt } from "@/usecase/homeUseCases";

const barbearia = (id: string, name: string): Barbershop => ({
  id,
  name,
  address: `Rua ${name}, 10`,
  phone: "",
  avatarUrl: `https://img/${id}.jpg`,
});

const servico = (barbershopId: string, name: string): Service => ({
  id: `${barbershopId}-${name}`,
  barbershopId,
  name,
  description: null,
  durationMinutes: 30,
  price: 40,
  imageUrl: null,
});

/** Quinta-feira, 12/11/2026, 10:00. */
const AGORA = new Date(2026, 10, 12, 10, 0);
const QUINTA = AGORA.getDay();

const fonte = (
  barbearias: Barbershop[],
  servicos: Record<string, string[]>,
  horarios: Record<string, BusinessHours[]>,
): IBarbershopDataSource =>
  ({
    listBarbershops: async () => barbearias,
    listServices: async (id: string) => {
      if (!servicos[id]) throw new Error("falhou");
      return servicos[id].map((n) => servico(id, n));
    },
    listBusinessHours: async (id: string) => horarios[id] ?? [],
  }) as unknown as IBarbershopDataSource;

describe("HomeUseCases", () => {
  it("deduz as categorias pelo nome do serviço", () => {
    expect(categoriesOf({ name: "Corte degradê" })).toEqual(["cabelo"]);
    expect(categoriesOf({ name: "Barba completa" })).toEqual(["barba"]);
    expect(categoriesOf({ name: "Corte & Barba" })).toEqual(["cabelo", "barba", "combo"]);
    expect(categoriesOf({ name: "Combo do Pai" })).toEqual(["combo"]);
    expect(categoriesOf({ name: "Design de Sobrancelha" })).toEqual(["sobrancelha"]);
    expect(categoriesOf({ name: "Hidratação" })).toEqual([]);
  });

  it("aberta só entre a abertura e o fechamento de hoje; sem horário cadastrado é null", () => {
    const horas: BusinessHours[] = [{ dayOfWeek: QUINTA, openTime: "09:00", closeTime: "18:00" }];
    expect(isOpenAt(horas, AGORA)).toBe(true);
    expect(isOpenAt(horas, new Date(2026, 10, 12, 18, 0))).toBe(false);
    expect(isOpenAt(horas, new Date(2026, 10, 12, 8, 59))).toBe(false);
    expect(isOpenAt([{ dayOfWeek: (QUINTA + 1) % 7, openTime: "09:00", closeTime: "18:00" }], AGORA)).toBe(false);
    expect(isOpenAt([], AGORA)).toBeNull();
  });

  it("monta os destaques com dados reais: abertas primeiro, depois por nome", async () => {
    const casos = new HomeUseCases(
      fonte(
        [barbearia("a", "Zeca"), barbearia("b", "Bigode"), barbearia("c", "Arte")],
        { a: ["Corte"], b: ["Barba", "Sobrancelha"] },
        { a: [{ dayOfWeek: QUINTA, openTime: "08:00", closeTime: "20:00" }] },
      ),
    );
    const destaques = await casos.getHighlights(AGORA);
    expect(destaques.map((d) => d.id)).toEqual(["a", "c", "b"]);
    expect(destaques[0]).toEqual({
      id: "a",
      name: "Zeca",
      location: "Rua Zeca, 10",
      rating: null,
      reviewCount: null,
      distanceKm: null,
      imageUrl: "https://img/a.jpg",
      categories: ["cabelo"],
      isOpen: true,
    });
    // Sem serviços (a rota falhou) ainda aparece, sem categoria; sem horário, status null.
    expect(destaques[1]).toMatchObject({ id: "c", categories: [], isOpen: null });
    expect(destaques[2]).toMatchObject({ categories: ["barba", "sobrancelha"], isOpen: null });
  });

  it("filtra pela categoria e mostra todas sem filtro", async () => {
    const muitas = Array.from({ length: 7 }, (_, i) => barbearia(`b${i}`, `Barbearia ${i}`));
    const servicos = Object.fromEntries(muitas.map((b, i) => [b.id, i === 0 ? ["Barba"] : ["Corte"]]));
    const casos = new HomeUseCases(fonte(muitas, servicos, {}));
    const destaques = await casos.getHighlights(AGORA);
    expect(casos.filterHighlights(destaques, null)).toHaveLength(7);
    expect(casos.filterHighlights(destaques, "barba").map((d) => d.id)).toEqual(["b0"]);
    expect(casos.filterHighlights(destaques, "sobrancelha")).toEqual([]);
    // Pesquisa por nome ou endereço, sem diferenciar maiúsculas e acentos; soma com a categoria.
    expect(casos.filterHighlights(destaques, null, "barbearia 3").map((d) => d.id)).toEqual(["b3"]);
    expect(casos.filterHighlights(destaques, null, "  RUA barbearia 0 ").map((d) => d.id)).toEqual(["b0"]);
    expect(casos.filterHighlights(destaques, "barba", "barbearia 3")).toEqual([]);
  });
});
