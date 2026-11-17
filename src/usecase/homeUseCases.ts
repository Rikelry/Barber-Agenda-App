import type { IHomeDataSource } from "@/model/datasources/iHomeDataSource";
import type { Appointment } from "@/model/entities/appointment";
import type { BarbershopHighlight, ServiceCategory } from "@/model/entities/highlight";
import type { IHomeUseCases } from "@/usecase/iHomeUseCases";

export class HomeUseCases implements IHomeUseCases {
  constructor(private readonly dataSource: IHomeDataSource) {}

  async getHighlights(category?: ServiceCategory | null): Promise<BarbershopHighlight[]> {
    const highlights = await this.dataSource.listHighlights();
    return highlights
      .filter((h) => !category || h.categories.includes(category))
      .sort((a, b) => b.rating - a.rating);
  }

  async getNextAppointment(now: Date = new Date()): Promise<Appointment | null> {
    const appointments = await this.dataSource.listMyAppointments();
    const futuros = appointments
      .filter((a) => a.status !== "cancelled" && a.startsAt.getTime() >= now.getTime())
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    return futuros[0] ?? null;
  }
}
