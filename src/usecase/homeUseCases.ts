import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { BusinessHours } from "@/model/entities/businessHours";
import type { BarbershopHighlight, ServiceCategory } from "@/model/entities/highlight";
import type { Service } from "@/model/entities/service";
import type { IHomeUseCases } from "@/usecase/iHomeUseCases";

/** Minúsculas e sem acento, para comparar nomes de serviço. */
const normalizar = (texto: string) => texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** Palavras do nome do serviço que indicam cada categoria (comparadas sem acento). */
const PALAVRAS: Record<Exclude<ServiceCategory, "combo">, string[]> = {
  cabelo: ["corte", "cabelo", "fade", "degrade", "social", "tesoura", "maquina", "pigment", "luzes", "platinad", "progressiva"],
  barba: ["barba", "bigode"],
  sobrancelha: ["sobrancelha"],
};

const temPalavra = (texto: string, palavras: string[]) => palavras.some((p) => texto.includes(p));

/** Categorias de um serviço. Combo: o nome diz "combo" ou junta cabelo e barba. */
export const categoriesOf = (service: Pick<Service, "name">): ServiceCategory[] => {
  const nome = normalizar(service.name);
  const cabelo = temPalavra(nome, PALAVRAS.cabelo);
  const barba = temPalavra(nome, PALAVRAS.barba);
  const categorias: ServiceCategory[] = [];
  if (cabelo) categorias.push("cabelo");
  if (barba) categorias.push("barba");
  if (nome.includes("combo") || (cabelo && barba)) categorias.push("combo");
  if (temPalavra(nome, PALAVRAS.sobrancelha)) categorias.push("sobrancelha");
  return categorias;
};

/** Aberta se a hora atual está entre a abertura e o fechamento de hoje ("HH:mm"). */
export const isOpenAt = (hours: BusinessHours[], now: Date): boolean | null => {
  if (hours.length === 0) return null;
  const hoje = hours.find((h) => h.dayOfWeek === now.getDay());
  if (!hoje) return false;
  const agora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return hoje.openTime <= agora && agora < hoje.closeTime;
};

const ORDEM_CATEGORIAS: ServiceCategory[] = ["cabelo", "barba", "combo", "sobrancelha"];

export class HomeUseCases implements IHomeUseCases {
  constructor(private readonly dataSource: IBarbershopDataSource) {}

  async getHighlights(now: Date = new Date()): Promise<BarbershopHighlight[]> {
    const barbershops = await this.dataSource.listBarbershops();
    const highlights = await Promise.all(
      barbershops.map(async (b): Promise<BarbershopHighlight> => {
        // Sem serviços ou horários a barbearia ainda aparece, só sem categoria ou status.
        const [services, hours] = await Promise.all([
          this.dataSource.listServices(b.id).catch(() => []),
          this.dataSource.listBusinessHours(b.id).catch(() => []),
        ]);
        const categorias = new Set(services.flatMap(categoriesOf));
        return {
          id: b.id,
          name: b.name,
          location: b.address,
          rating: null,
          reviewCount: null,
          distanceKm: null,
          imageUrl: b.avatarUrl,
          categories: ORDEM_CATEGORIAS.filter((c) => categorias.has(c)),
          isOpen: isOpenAt(hours, now),
        };
      }),
    );
    return highlights.sort(
      (a, b) =>
        Number(b.isOpen === true) - Number(a.isOpen === true) ||
        (b.rating ?? 0) - (a.rating ?? 0) ||
        a.name.localeCompare(b.name, "pt-BR"),
    );
  }

  filterHighlights(
    highlights: BarbershopHighlight[],
    category: ServiceCategory | null,
    search: string = "",
  ): BarbershopHighlight[] {
    const termo = normalizar(search).replace(/\s+/g, " ").trim();
    return highlights.filter(
      (h) =>
        (!category || h.categories.includes(category)) &&
        (termo === "" || normalizar(h.name).includes(termo) || normalizar(h.location).includes(termo)),
    );
  }
}
