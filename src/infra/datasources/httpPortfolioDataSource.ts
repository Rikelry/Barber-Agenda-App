// Portfólio na API: /portfolio (backend/src/portfolio).

import type { NewPortfolioPhoto, IPortfolioDataSource } from "@/model/datasources/iPortfolioDataSource";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import { DomainError } from "@/model/errors";
import type { IApiService } from "@/model/services/iApiService";

type FotoDto = {
  id: string;
  professionalId: string;
  professionalName?: string;
  barbershopId?: string;
  imageUrl: string;
  caption: string | null;
  serviceId: string | null;
  serviceName?: string | null;
  featured: boolean;
  createdAt: string;
};

const segment = (v: string) => encodeURIComponent(v);

export const toPortfolioPhoto = (dto: FotoDto): PortfolioPhoto => ({
  id: dto.id,
  professionalId: dto.professionalId,
  professionalName: dto.professionalName ?? "",
  barbershopId: dto.barbershopId ?? "",
  imageUrl: dto.imageUrl,
  caption: dto.caption ?? null,
  serviceId: dto.serviceId ?? null,
  serviceName: dto.serviceName ?? null,
  featured: Boolean(dto.featured),
  createdAt: new Date(dto.createdAt),
});

const lista = (data: unknown): PortfolioPhoto[] => {
  if (!Array.isArray(data)) throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
  return (data as FotoDto[]).map(toPortfolioPhoto);
};

export class HttpPortfolioDataSource implements IPortfolioDataSource {
  constructor(private readonly api: IApiService) {}

  async listMine(): Promise<PortfolioPhoto[]> {
    return lista(await this.api.get("/portfolio/me"));
  }

  async listByProfessional(professionalId: string): Promise<PortfolioPhoto[]> {
    return lista(await this.api.get(`/portfolio/professionals/${segment(professionalId)}`));
  }

  async listByBarbershop(barbershopId: string): Promise<PortfolioPhoto[]> {
    return lista(await this.api.get(`/portfolio/barbershops/${segment(barbershopId)}`));
  }

  async listFeatured(): Promise<PortfolioPhoto[]> {
    return lista(await this.api.get("/portfolio/featured"));
  }

  async publish(data: NewPortfolioPhoto): Promise<PortfolioPhoto> {
    return toPortfolioPhoto(await this.api.post<FotoDto>("/portfolio/me", data));
  }

  async remove(id: string): Promise<void> {
    await this.api.delete(`/portfolio/me/${segment(id)}`);
  }
}
