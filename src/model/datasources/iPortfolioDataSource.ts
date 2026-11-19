import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";

export type NewPortfolioPhoto = {
  imageUrl: string;
  caption: string | null;
  serviceId: string | null;
  featured: boolean;
  clientConsent: boolean;
};

/** Fotos do portfólio na API. */
export interface IPortfolioDataSource {
  listMine(): Promise<PortfolioPhoto[]>;
  listByProfessional(professionalId: string): Promise<PortfolioPhoto[]>;
  listByBarbershop(barbershopId: string): Promise<PortfolioPhoto[]>;
  listFeatured(): Promise<PortfolioPhoto[]>;
  publish(data: NewPortfolioPhoto): Promise<PortfolioPhoto>;
  remove(id: string): Promise<void>;
}
