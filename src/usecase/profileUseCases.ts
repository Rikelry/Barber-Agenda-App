import type { IUserDataSource } from "@/model/datasources/iUserDataSource";
import type { User } from "@/model/entities/user";
import { ValidationError } from "@/model/errors";
import type { IProfileUseCases, ProfileField, ProfileForm } from "@/usecase/iProfileUseCases";

export const MIN_PASSWORD_LENGTH = 8;

const digits = (text: string) => text.replace(/\D/g, "");

/** Regras do formulário de perfil (padrão 4 de 05-padroes.md). */
export const validateProfile = (form: ProfileForm): Partial<Record<ProfileField, string>> => {
  const errors: Partial<Record<ProfileField, string>> = {};
  if (form.name.trim().length < 3) errors.name = "Informe o nome completo.";
  const phone = digits(form.phone);
  if (phone.length < 10 || phone.length > 11) errors.phone = "Informe o celular com DDD.";
  if (form.newPassword) {
    if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
      errors.newPassword = `A nova senha precisa de pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }
    if (!form.currentPassword) errors.currentPassword = "Digite a senha atual para trocar a senha.";
  }
  return errors;
};

export class ProfileUseCases implements IProfileUseCases {
  constructor(private readonly dataSource: IUserDataSource) {}

  getProfile(): Promise<User> {
    return this.dataSource.getCurrentUser();
  }

  async saveProfile(form: ProfileForm): Promise<User> {
    const errors = validateProfile(form);
    if (Object.keys(errors).length > 0) throw new ValidationError<ProfileField>(errors);

    if (form.newPassword) {
      await this.dataSource.changePassword(form.currentPassword, form.newPassword);
    }
    return this.dataSource.updateProfile({ name: form.name.trim(), phone: digits(form.phone) });
  }
}
