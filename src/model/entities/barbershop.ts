export type Barbershop = {
  id: string;
  name: string;
  address: string;
  phone: string;
  avatarUrl: string | null;
  /** Dono da barbearia (usuário). */
  ownerId?: string;
};
