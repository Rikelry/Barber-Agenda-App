// Destaques e agendamentos de exemplo em memória. A API ainda não tem nota nem bairro das
// barbearias e exige login; troque por uma fonte HTTP quando esses dados existirem.

import type { IHomeDataSource } from "@/model/datasources/iHomeDataSource";
import type { Appointment } from "@/model/entities/appointment";
import type { BarbershopHighlight } from "@/model/entities/highlight";

const atraso = () => new Promise((resolve) => setTimeout(resolve, 300));

/** Amanhã às 15:00, para o exemplo sempre mostrar um agendamento futuro. */
const amanhaAs15 = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(15, 0, 0, 0);
  return d;
};

const DESTAQUES: BarbershopHighlight[] = [
  {
    id: "b1",
    name: "Barbearia Don Corleone",
    neighborhood: "Bela Vista",
    rating: 4.9,
    imageUrl: null,
    categories: ["cabelo", "barba", "combo"],
  },
  {
    id: "b2",
    name: "Vintage Cut Club",
    neighborhood: "Pinheiros",
    rating: 4.8,
    imageUrl: null,
    categories: ["cabelo", "combo", "sobrancelha"],
  },
  {
    id: "b3",
    name: "Navalha de Ouro",
    neighborhood: "Moema",
    rating: 4.6,
    imageUrl: null,
    categories: ["barba", "sobrancelha"],
  },
];

export class InMemoryHomeDataSource implements IHomeDataSource {
  async listHighlights(): Promise<BarbershopHighlight[]> {
    await atraso();
    return DESTAQUES.map((d) => ({ ...d, categories: [...d.categories] }));
  }

  async listMyAppointments(): Promise<Appointment[]> {
    await atraso();
    return [
      {
        id: "a1",
        barbershopName: "Barbearia Don Corleone",
        professionalName: "Alessandro",
        serviceNames: ["Corte", "Barba"],
        startsAt: amanhaAs15(),
        status: "confirmed",
      },
    ];
  }
}
