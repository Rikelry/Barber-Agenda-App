/** Foto do portfólio de um profissional (o corte que ele fez). */
export type PortfolioPhoto = {
  id: string;
  professionalId: string;
  professionalName: string;
  barbershopId: string;
  imageUrl: string;
  caption: string | null;
  serviceId: string | null;
  serviceName: string | null;
  /** Aparece nas Inspirações do Início. */
  featured: boolean;
  createdAt: Date;
};
