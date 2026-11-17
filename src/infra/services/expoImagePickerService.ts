// Galeria do aparelho com expo-image-picker: pede permissão e devolve a foto escolhida,
// recortada em quadrado e comprimida para o upload ficar leve.

import * as ImagePicker from "expo-image-picker";

import type { LocalFile } from "@/model/services/iApiService";
import type { IImagePickerService } from "@/model/services/iImagePickerService";

export class ExpoImagePickerService implements IImagePickerService {
  async pickImage(): Promise<LocalFile | null> {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) return null;
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    const foto = resultado.canceled ? null : resultado.assets[0];
    if (!foto) return null;
    const mimeType = foto.mimeType ?? "image/jpeg";
    return {
      uri: foto.uri,
      mimeType,
      name: foto.fileName ?? `foto.${mimeType.split("/")[1] ?? "jpg"}`,
    };
  }
}
