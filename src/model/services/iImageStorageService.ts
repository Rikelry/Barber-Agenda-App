import type { LocalFile } from "@/model/services/iApiService";

export type ImageFolder = "barbershops" | "services" | "professionals" | "users" | "portfolio";

/** Guarda a imagem no servidor e devolve a URL pública. */
export interface IImageStorageService {
  upload(file: LocalFile, folder: ImageFolder, ownerId?: string): Promise<string>;
}
