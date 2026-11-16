import type { Appointment } from "@/model/entities/appointment";

/** Agendamento como a API devolve: sem o nome da barbearia, que vem de outra rota. */
export type AppointmentData = Omit<Appointment, "barbershopName">;

export type BookingRequest = {
  professionalId: string;
  serviceId: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:mm" */
  time: string;
};

export interface IAppointmentDataSource {
  listMine(): Promise<AppointmentData[]>;
  create(request: BookingRequest): Promise<AppointmentData>;
  cancel(appointmentId: string): Promise<void>;
  reschedule(appointmentId: string, date: string, time: string): Promise<AppointmentData>;
  /** Horários livres ("HH:mm") do profissional para o serviço na data. */
  listAvailableSlots(barbershopId: string, professionalId: string, serviceId: string, date: string): Promise<string[]>;
}
