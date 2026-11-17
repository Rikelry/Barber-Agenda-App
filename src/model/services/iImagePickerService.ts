import type { LocalFile } from "@/model/services/iApiService";

/** Escolha de foto na galeria do aparelho. */
export interface IImagePickerService {
  /** null quando a pessoa desiste ou não dá permissão. */
  pickImage(): Promise<LocalFile | null>;
}
