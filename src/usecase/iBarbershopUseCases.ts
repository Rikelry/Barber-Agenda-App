import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";

export type BarbershopDetail = {
  barbershop: Barbershop;
  services: Service[];
  professionals: Professional[];
};

/** Barbeiro com a barbearia onde trabalha (lista geral de barbeiros). */
export type BarberSummary = {
  professional: Professional;
  barbershop: Barbershop;
};

export type BarberProfile = {
  professional: Professional;
  barbershop: Barbershop;
  services: Service[];
};

export interface IBarbershopUseCases {
  /** Barbearias em ordem alfabética, filtradas por nome ou endereço. */
  listBarbershops(search?: string): Promise<Barbershop[]>;
  getBarbershopDetail(barbershopId: string): Promise<BarbershopDetail>;
  /** Barbeiros de todas as barbearias, filtrados por nome, especialidade ou barbearia. */
  listBarbers(search?: string): Promise<BarberSummary[]>;
  getBarberProfile(barbershopId: string, professionalId: string): Promise<BarberProfile>;
}
