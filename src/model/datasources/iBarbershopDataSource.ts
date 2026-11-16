import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";

export interface IBarbershopDataSource {
  listBarbershops(): Promise<Barbershop[]>;
  getBarbershop(id: string): Promise<Barbershop>;
  listProfessionals(barbershopId: string): Promise<Professional[]>;
  getProfessional(barbershopId: string, professionalId: string): Promise<Professional>;
  listServices(barbershopId: string): Promise<Service[]>;
}
