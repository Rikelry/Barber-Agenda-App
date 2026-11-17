// Envia imagens para /storage/upload do backend (multipart, campo "file") e devolve a URL.

import { DomainError } from "@/model/errors";
import type { IApiService, LocalFile } from "@/model/services/iApiService";
import type { IImageStorageService, ImageFolder } from "@/model/services/iImageStorageService";

export class HttpImageStorageService implements IImageStorageService {
  constructor(private readonly api: IApiService) {}

  async upload(file: LocalFile, folder: ImageFolder, ownerId?: string): Promise<string> {
    const resposta = await this.api.upload<{ url?: unknown }>("/storage/upload", file, {
      folder,
      ...(ownerId && { id: ownerId }),
    });
    if (typeof resposta?.url !== "string") {
      throw new DomainError("Não foi possível enviar a imagem.", "INVALID_DATA");
    }
    return resposta.url;
  }
}
