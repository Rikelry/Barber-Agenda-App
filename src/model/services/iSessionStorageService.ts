import type { Session } from "@/model/entities/session";

/** Guarda a sessão entre aberturas do app. */
export interface ISessionStorageService {
  load(): Promise<Session | null>;
  /** null apaga a sessão guardada. */
  save(session: Session | null): Promise<void>;
}
