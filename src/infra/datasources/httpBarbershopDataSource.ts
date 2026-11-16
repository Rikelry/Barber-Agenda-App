// Barbearias, profissionais e serviços da API (/barbershops/...). Converte os DTOs do backend
// (backend/src/*/adapters/dtos) nas entidades do domínio.

import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";
import { DomainError } from "@/model/errors";
import type { IApiService } from "@/model/services/iApiService";

type BarbershopDto = {
  id: string;
  name: string;
  address: string;
  phone: string;
  avatarUrl?: string | null;
};

type ProfessionalDto = {
  id: string;
  barbershopId: string;
  specialty: string | null;
  avatarUrl?: string | null;
  usuario: { id: string; name: string; email: string; phone: string; avatarUrl?: string | null };
};

type ServiceDto = {
  id: string;
  barbershopId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number | string;
  imageUrl?: string | null;
  avatarUrl?: string | null;
};

const asList = <T>(data: unknown): T[] => {
  if (!Array.isArray(data)) {
    throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
  }
  return data as T[];
};

export const toBarbershop = (dto: BarbershopDto): Barbershop => ({
  id: dto.id,
  name: dto.name,
  address: dto.address,
  phone: dto.phone,
  avatarUrl: dto.avatarUrl ?? null,
});

export const toProfessional = (dto: ProfessionalDto): Professional => ({
  id: dto.id,
  barbershopId: dto.barbershopId,
  name: dto.usuario.name,
  email: dto.usuario.email,
  phone: dto.usuario.phone,
  specialty: dto.specialty,
  avatarUrl: dto.avatarUrl ?? dto.usuario.avatarUrl ?? null,
});

export const toService = (dto: ServiceDto): Service => ({
  id: dto.id,
  barbershopId: dto.barbershopId,
  name: dto.name,
  description: dto.description,
  durationMinutes: dto.durationMinutes,
  price: Number(dto.price),
  imageUrl: dto.imageUrl ?? dto.avatarUrl ?? null,
});

const segment = (id: string) => encodeURIComponent(id);

export class HttpBarbershopDataSource implements IBarbershopDataSource {
  constructor(private readonly http: IApiService) {}

  async listBarbershops(): Promise<Barbershop[]> {
    return asList<BarbershopDto>(await this.http.get("/barbershops")).map(toBarbershop);
  }

  async getBarbershop(id: string): Promise<Barbershop> {
    return toBarbershop(await this.http.get<BarbershopDto>(`/barbershops/${segment(id)}`));
  }

  async listProfessionals(barbershopId: string): Promise<Professional[]> {
    return asList<ProfessionalDto>(
      await this.http.get(`/barbershops/${segment(barbershopId)}/professionals`),
    ).map(toProfessional);
  }

  async getProfessional(barbershopId: string, professionalId: string): Promise<Professional> {
    return toProfessional(
      await this.http.get<ProfessionalDto>(
        `/barbershops/${segment(barbershopId)}/professionals/${segment(professionalId)}`,
      ),
    );
  }

  async listServices(barbershopId: string): Promise<Service[]> {
    return asList<ServiceDto>(await this.http.get(`/barbershops/${segment(barbershopId)}/services`)).map(
      toService,
    );
  }
}
