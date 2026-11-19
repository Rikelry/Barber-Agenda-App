import type { IPortfolioDataSource } from "@/model/datasources/iPortfolioDataSource";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import { DomainError, ValidationError } from "@/model/errors";
import type { LocalFile } from "@/model/services/iApiService";
import type { IImageStorageService } from "@/model/services/iImageStorageService";
import type { IPortfolioUseCases, PortfolioPhotoField, PortfolioPhotoForm } from "@/usecase/iPortfolioUseCases";

export const MAX_CAPTION_LENGTH = 120;

export class PortfolioUseCases implements IPortfolioUseCases {
  constructor(
    private readonly dataSource: IPortfolioDataSource,
    private readonly storage: IImageStorageService,
  ) {}

  listMine(): Promise<PortfolioPhoto[]> {
    return this.dataSource.listMine();
  }

  listByProfessional(professionalId: string): Promise<PortfolioPhoto[]> {
    return this.dataSource.listByProfessional(professionalId);
  }

  listByBarbershop(barbershopId: string): Promise<PortfolioPhoto[]> {
    return this.dataSource.listByBarbershop(barbershopId);
  }

  listInspirations(): Promise<PortfolioPhoto[]> {
    return this.dataSource.listFeatured();
  }

  async getPhoto(professionalId: string, photoId: string): Promise<PortfolioPhoto> {
    const foto = (await this.dataSource.listByProfessional(professionalId)).find((f) => f.id === photoId);
    if (!foto) throw new DomainError("Essa foto não está mais no portfólio.", "NOT_FOUND");
    return foto;
  }

  async publish(form: PortfolioPhotoForm, photo: LocalFile | null): Promise<PortfolioPhoto> {
    const erros: Partial<Record<PortfolioPhotoField, string>> = {};
    if (!photo) erros.photo = "Escolha uma foto do seu trabalho.";
    if (form.caption.trim().length > MAX_CAPTION_LENGTH) erros.caption = `Use no máximo ${MAX_CAPTION_LENGTH} caracteres.`;
    if (!form.consent) erros.consent = "Confirme que o cliente autorizou a publicação.";
    if (Object.keys(erros).length > 0 || !photo) throw new ValidationError(erros);

    const imageUrl = await this.storage.upload(photo, "portfolio");
    return this.dataSource.publish({
      imageUrl,
      caption: form.caption.trim() || null,
      serviceId: form.serviceId,
      featured: form.featured,
      clientConsent: true,
    });
  }

  remove(photoId: string): Promise<void> {
    return this.dataSource.remove(photoId);
  }
}
