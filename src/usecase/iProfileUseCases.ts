import type { User } from "@/model/entities/user";

export type ProfileForm = {
  name: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
};

export type ProfileField = keyof ProfileForm;

export interface IProfileUseCases {
  getProfile(): Promise<User>;
  /** Valida e salva os dados; troca a senha só quando a nova foi preenchida. */
  saveProfile(form: ProfileForm): Promise<User>;
}
