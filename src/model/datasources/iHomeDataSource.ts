import type { Appointment } from "@/model/entities/appointment";
import type { BarbershopHighlight } from "@/model/entities/highlight";

export interface IHomeDataSource {
  listHighlights(): Promise<BarbershopHighlight[]>;
  listMyAppointments(): Promise<Appointment[]>;
}
