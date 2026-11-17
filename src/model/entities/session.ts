import type { User } from "@/model/entities/user";

/** Papéis do usuário na API: o mesmo usuário pode ser cliente, profissional e dono. */
export type UserRole = "cliente" | "profissional" | "owner";

/** Usuário logado e o token JWT que a API exige. */
export type Session = {
  token: string;
  user: User;
  roles: UserRole[];
};
