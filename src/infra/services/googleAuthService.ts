// Login do Google no aparelho (@react-native-google-signin). Só devolve o ID token;
// quem valida a assinatura e cria/loga o usuário é o backend.

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

import { DomainError } from "@/model/errors";
import type { GoogleCredential, IGoogleAuthService } from "@/model/services/iGoogleAuthService";

const traduzirErro = (erro: unknown): DomainError => {
  if (erro instanceof DomainError) return erro;
  if (isErrorWithCode(erro)) {
    switch (erro.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return new DomainError("Login com Google cancelado.", "CANCELLED");
      case statusCodes.IN_PROGRESS:
        return new DomainError("Já existe um login com Google em andamento.", "INVALID_DATA");
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return new DomainError("Atualize o Google Play Services para entrar com o Google.", "INVALID_DATA");
      default:
        break;
    }
  }
  return new DomainError("Não foi possível entrar com o Google. Tente novamente.", "SERVER");
};

export class GoogleAuthService implements IGoogleAuthService {
  constructor() {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }

  async signIn(): Promise<GoogleCredential> {
    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).catch((erro: unknown) => {
        throw traduzirErro(erro);
      });
    }

    const resposta = await GoogleSignin.signIn().catch((erro: unknown) => {
      throw traduzirErro(erro);
    });

    if (!isSuccessResponse(resposta)) throw new DomainError("Login com Google cancelado.", "CANCELLED");
    if (!resposta.data.idToken) {
      throw new DomainError("Não foi possível ler a sua conta Google. Tente novamente.", "INVALID_DATA");
    }
    return { idToken: resposta.data.idToken };
  }
}
