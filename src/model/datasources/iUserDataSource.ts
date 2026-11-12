import type { User } from "@/model/entities/user";

export type ProfileUpdate = { name: string; phone: string };

export interface IUserDataSource {
  getCurrentUser(): Promise<User>;
  updateProfile(update: ProfileUpdate): Promise<User>;
  /** Falha com DomainError quando a senha atual não confere. */
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
}
