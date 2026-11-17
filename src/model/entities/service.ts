/** Serviço oferecido pela barbearia (corte, barba, combo...). Preço em reais. */
export type Service = {
  id: string;
  barbershopId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  imageUrl: string | null;
};
