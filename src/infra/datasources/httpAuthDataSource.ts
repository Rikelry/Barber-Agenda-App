// Autenticação na API (/auth/...). Converte o LoginResponseDTO do servidor
// (src/infra/http/dtos/UsuarioDTO.ts) na Session do domínio.

import type { IAuthDataSource, RegisterData } from "@/model/datasources/iAuthDataSource";
import type { Session, UserRole } from "@/model/entities/session";
import { DomainError } from "@/model/errors";
import type { IApiService } from "@/model/services/iApiService";

type UsuarioDto = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles?: UserRole[];
  role?: UserRole;
  createdAt: string;
  avatarUrl?: string | null;
};

type LoginDto = { token: string; usuario: UsuarioDto };

export const toSession = (dto: LoginDto): Session => {
  if (!dto?.token || !dto.usuario) {
    throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
  }
  const { usuario } = dto;
  return {
    token: dto.token,
    user: {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      phone: usuario.phone,
      avatarUrl: usuario.avatarUrl ?? null,
      memberSince: new Date(usuario.createdAt),
    },
    roles: usuario.roles ?? (usuario.role ? [usuario.role] : ["cliente"]),
  };
};

export class HttpAuthDataSource implements IAuthDataSource {
  constructor(private readonly api: IApiService) {}

  async login(email: string, password: string): Promise<Session> {
    return toSession(await this.api.post<LoginDto>("/auth/login", { email, password }));
  }

  async register(data: RegisterData): Promise<void> {
    await this.api.post("/auth/register", data);
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.api.post("/auth/recover-password", { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.api.patch("/auth/reset-password", { token, newPassword });
  }

  async refreshToken(): Promise<Session> {
    return toSession(await this.api.post<LoginDto>("/auth/refresh-token"));
  }
}
