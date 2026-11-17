import type { Appointment } from "@/model/entities/appointment";
import type { BarbershopHighlight, ServiceCategory } from "@/model/entities/highlight";

export interface IHomeUseCases {
  /** Destaques da semana, da maior para a menor nota, filtrados pela categoria escolhida. */
  getHighlights(category?: ServiceCategory | null): Promise<BarbershopHighlight[]>;
  /** O próximo agendamento que ainda vai acontecer e não foi cancelado, ou null. */
  getNextAppointment(now?: Date): Promise<Appointment | null>;
}
