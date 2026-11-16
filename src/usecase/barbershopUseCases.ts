import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { Barbershop } from "@/model/entities/barbershop";
import type {
  BarberProfile,
  BarberSummary,
  BarbershopDetail,
  IBarbershopUseCases,
} from "@/usecase/iBarbershopUseCases";

/** Ignora maiúsculas, acentos e espaços repetidos. */
export const normalizeSearch = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const matches = (search: string | undefined, ...fields: (string | null)[]): boolean => {
  const term = normalizeSearch(search ?? "");
  return term === "" || fields.some((f) => f !== null && normalizeSearch(f).includes(term));
};

const byName = (a: string, b: string) => a.localeCompare(b, "pt-BR");

export class BarbershopUseCases implements IBarbershopUseCases {
  constructor(private readonly dataSource: IBarbershopDataSource) {}

  async listBarbershops(search?: string): Promise<Barbershop[]> {
    const barbershops = await this.dataSource.listBarbershops();
    return barbershops
      .filter((b) => matches(search, b.name, b.address))
      .sort((a, b) => byName(a.name, b.name));
  }

  async getBarbershopDetail(barbershopId: string): Promise<BarbershopDetail> {
    const [barbershop, services, professionals] = await Promise.all([
      this.dataSource.getBarbershop(barbershopId),
      this.dataSource.listServices(barbershopId),
      this.dataSource.listProfessionals(barbershopId),
    ]);
    return {
      barbershop,
      services: [...services].sort((a, b) => a.price - b.price),
      professionals: [...professionals].sort((a, b) => byName(a.name, b.name)),
    };
  }

  async listBarbers(search?: string): Promise<BarberSummary[]> {
    const barbershops = await this.dataSource.listBarbershops();
    const lists = await Promise.all(
      barbershops.map(async (barbershop) =>
        (await this.dataSource.listProfessionals(barbershop.id)).map((professional) => ({
          professional,
          barbershop,
        })),
      ),
    );
    return lists
      .flat()
      .filter(({ professional, barbershop }) =>
        matches(search, professional.name, professional.specialty, barbershop.name),
      )
      .sort((a, b) => byName(a.professional.name, b.professional.name));
  }

  async getBarberProfile(barbershopId: string, professionalId: string): Promise<BarberProfile> {
    const [professional, barbershop, services] = await Promise.all([
      this.dataSource.getProfessional(barbershopId, professionalId),
      this.dataSource.getBarbershop(barbershopId),
      this.dataSource.listServices(barbershopId),
    ]);
    return { professional, barbershop, services: [...services].sort((a, b) => a.price - b.price) };
  }
}
