export type User = {
  id: string;
  name: string;
  phone: string;
  /** Só leitura no perfil: trocar o e-mail exige outro fluxo. */
  email: string;
  avatarUrl: string | null;
  memberSince: Date;
};
