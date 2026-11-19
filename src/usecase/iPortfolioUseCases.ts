import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import type { LocalFile } from "@/model/services/iApiService";

export type PortfolioPhotoField = "photo" | "caption" | "consent";

export type PortfolioPhotoForm = {
  caption: string;
  serviceId: string | null;
  featured: boolean;
  /** O profissional confirma que o cliente autorizou a publicação (LGPD). */
  consent: boolean;
};

export interface IPortfolioUseCases {
  listMine(): Promise<PortfolioPhoto[]>;
  listByProfessional(professionalId: string): Promise<PortfolioPhoto[]>;
  listByBarbershop(barbershopId: string): Promise<PortfolioPhoto[]>;
  /** Fotos marcadas para as Inspirações do Início. */
  listInspirations(): Promise<PortfolioPhoto[]>;
  /** Busca uma foto pelo id na lista do profissional. */
  getPhoto(professionalId: string, photoId: string): Promise<PortfolioPhoto>;
  /** Confere os campos, envia a imagem e publica. Erros por campo vêm em ValidationError. */
  publish(form: PortfolioPhotoForm, photo: LocalFile | null): Promise<PortfolioPhoto>;
  remove(photoId: string): Promise<void>;
}
