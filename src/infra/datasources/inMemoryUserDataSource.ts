// Usuário de exemplo em memória, até existir a tela de login que entrega o usuário real
// (GET/PATCH /users/me no backend).

import type { IUserDataSource, ProfileUpdate } from "@/model/datasources/iUserDataSource";
import type { User } from "@/model/entities/user";
import { ValidationError } from "@/model/errors";

const atraso = () => new Promise((resolve) => setTimeout(resolve, 300));

export class InMemoryUserDataSource implements IUserDataSource {
  private user: User = {
    id: "u-exemplo",
    name: "Felipe Albuquerque",
    phone: "11987654321",
    email: "felipe.alb@provedor.com",
    avatarUrl: null,
    memberSince: new Date(2024, 0, 15),
  };

  private password = "senha1234";

  async getCurrentUser(): Promise<User> {
    await atraso();
    return { ...this.user };
  }

  async updateProfile(update: ProfileUpdate): Promise<User> {
    await atraso();
    this.user = { ...this.user, ...update };
    return { ...this.user };
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await atraso();
    if (currentPassword !== this.password) {
      throw new ValidationError({ currentPassword: "A senha atual não confere." });
    }
    this.password = newPassword;
  }
}
