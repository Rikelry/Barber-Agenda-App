// Dados do usuário logado na API (/users/me): leitura, nome e telefone, e troca de senha.

import type { IUserDataSource, ProfileUpdate } from "@/model/datasources/iUserDataSource";
import type { User } from "@/model/entities/user";
import { DomainError } from "@/model/errors";
import type { IApiService } from "@/model/services/iApiService";

type UsuarioDto = { id: string; name: string; email: string; phone: string; createdAt: string; avatarUrl?: string | null };

const toUser = (dados: { usuario?: UsuarioDto }): User => {
  const u = dados?.usuario;
  if (!u?.id) throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    avatarUrl: u.avatarUrl ?? null,
    memberSince: new Date(u.createdAt),
  };
};

export class HttpUserDataSource implements IUserDataSource {
  constructor(private readonly api: IApiService) {}

  async getCurrentUser(): Promise<User> {
    return toUser(await this.api.get("/users/me"));
  }

  async updateProfile(update: ProfileUpdate): Promise<User> {
    return toUser(await this.api.patch("/users/me", update));
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.patch("/users/me", { currentPassword, newPassword });
  }
}
