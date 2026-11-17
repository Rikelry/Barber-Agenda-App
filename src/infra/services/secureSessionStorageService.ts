// Sessão guardada no armazenamento seguro do celular (expo-secure-store). Na web, onde o
// SecureStore não existe, usa o localStorage do navegador.

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { Session, UserRole } from "@/model/entities/session";
import type { ISessionStorageService } from "@/model/services/iSessionStorageService";

const CHAVE = "barberagenda.sessao";

type SessaoGuardada = {
  token: string;
  roles: UserRole[];
  user: Omit<Session["user"], "memberSince"> & { memberSince: string };
};

const web = Platform.OS === "web";

const ler = async (): Promise<string | null> =>
  web ? (globalThis.localStorage?.getItem(CHAVE) ?? null) : SecureStore.getItemAsync(CHAVE);

const gravar = async (valor: string | null): Promise<void> => {
  if (web) {
    if (valor === null) globalThis.localStorage?.removeItem(CHAVE);
    else globalThis.localStorage?.setItem(CHAVE, valor);
    return;
  }
  if (valor === null) await SecureStore.deleteItemAsync(CHAVE);
  else await SecureStore.setItemAsync(CHAVE, valor);
};

export class SecureSessionStorageService implements ISessionStorageService {
  async load(): Promise<Session | null> {
    try {
      const texto = await ler();
      if (!texto) return null;
      const salvo = JSON.parse(texto) as SessaoGuardada;
      if (!salvo.token || !salvo.user?.id) return null;
      return { ...salvo, user: { ...salvo.user, memberSince: new Date(salvo.user.memberSince) } };
    } catch {
      // Dado corrompido ou armazenamento indisponível: começa sem sessão.
      return null;
    }
  }

  async save(session: Session | null): Promise<void> {
    try {
      if (!session) return await gravar(null);
      const guardar: SessaoGuardada = {
        ...session,
        user: { ...session.user, memberSince: session.user.memberSince.toISOString() },
      };
      await gravar(JSON.stringify(guardar));
    } catch {
      // Não conseguir guardar não impede de usar o app; só pede login na próxima abertura.
    }
  }
}
