import { describe, expect, it } from "@jest/globals";

import type { IHomeDataSource } from "@/model/datasources/iHomeDataSource";
import type { Appointment } from "@/model/entities/appointment";
import type { BarbershopHighlight } from "@/model/entities/highlight";
import { HomeUseCases } from "@/usecase/homeUseCases";

const destaque = (id: string, rating: number, categories: BarbershopHighlight["categories"]): BarbershopHighlight => ({
  id,
  name: id,
  neighborhood: "Centro",
  rating,
  imageUrl: null,
  categories,
});

const agendamento = (id: string, startsAt: Date, status: Appointment["status"]): Appointment => ({
  id,
  barbershopId: "b1",
  barbershopName: "Central",
  professionalId: "p1",
  professionalName: "Zé",
  serviceId: "s1",
  serviceName: "Corte",
  durationMinutes: 30,
  startsAt,
  endsAt: startsAt,
  status,
});

const AGORA = new Date(2026, 10, 12, 10, 0);

const fonte = (appointments: Appointment[]): IHomeDataSource => ({
  listHighlights: async () => [destaque("a", 4.2, ["barba"]), destaque("b", 4.9, ["cabelo", "barba"]), destaque("c", 4.5, ["cabelo"])],
  listMyAppointments: async () => appointments,
});

describe("HomeUseCases", () => {
  it("destaques ordenados pela nota e filtrados pela categoria", async () => {
    const casos = new HomeUseCases(fonte([]));
    expect((await casos.getHighlights()).map((h) => h.id)).toEqual(["b", "c", "a"]);
    expect((await casos.getHighlights("cabelo")).map((h) => h.id)).toEqual(["b", "c"]);
    expect(await casos.getHighlights("sobrancelha")).toEqual([]);
  });

  it("próximo agendamento ignora os passados e os cancelados", async () => {
    const casos = new HomeUseCases(
      fonte([
        agendamento("passado", new Date(2026, 10, 11, 15), "confirmed"),
        agendamento("cancelado", new Date(2026, 10, 12, 11), "cancelled"),
        agendamento("depois", new Date(2026, 10, 20, 9), "confirmed"),
        agendamento("proximo", new Date(2026, 10, 13, 15), "confirmed"),
      ]),
    );
    expect((await casos.getNextAppointment(AGORA))?.id).toBe("proximo");
    expect(await new HomeUseCases(fonte([])).getNextAppointment(AGORA)).toBeNull();
  });

  it("sem dados cadastrados, destaques e próximo agendamento ficam vazios", async () => {
    const vazio: IHomeDataSource = { listHighlights: async () => [], listMyAppointments: async () => [] };
    const casos = new HomeUseCases(vazio);
    expect(await casos.getHighlights()).toEqual([]);
    expect(await casos.getNextAppointment(AGORA)).toBeNull();
  });
});
