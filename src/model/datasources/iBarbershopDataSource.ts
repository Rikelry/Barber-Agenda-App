import type { Barbershop } from "@/model/entities/barbershop";
import type { BusinessHours } from "@/model/entities/businessHours";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";

export type BarbershopData = { name: string; address: string; phone: string; avatarUrl?: string | null };
export type ProfessionalData = { name: string; email: string; phone: string; password: string; specialty?: string };
export type ProfessionalUpdate = { name?: string; phone?: string; specialty?: string };
export type ServiceData = {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string | null;
};

export interface IBarbershopDataSource {
  listBarbershops(): Promise<Barbershop[]>;
  getBarbershop(id: string): Promise<Barbershop>;
  listProfessionals(barbershopId: string): Promise<Professional[]>;
  getProfessional(barbershopId: string, professionalId: string): Promise<Professional>;
  listServices(barbershopId: string): Promise<Service[]>;
  listBusinessHours(barbershopId: string): Promise<BusinessHours[]>;
  createBarbershop(data: BarbershopData): Promise<Barbershop>;
  updateBarbershop(id: string, data: Partial<BarbershopData>): Promise<Barbershop>;
  /** Cria ou atualiza o horário de um dia (a API não apaga dias). */
  saveBusinessHours(barbershopId: string, hours: BusinessHours): Promise<void>;
  createProfessional(barbershopId: string, data: ProfessionalData): Promise<Professional>;
  updateProfessional(barbershopId: string, professionalId: string, data: ProfessionalUpdate): Promise<Professional>;
  removeProfessional(barbershopId: string, professionalId: string): Promise<void>;
  createService(barbershopId: string, data: ServiceData): Promise<Service>;
  updateService(barbershopId: string, serviceId: string, data: Partial<ServiceData>): Promise<Service>;
}
