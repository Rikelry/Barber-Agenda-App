import type { Appointment } from "@/model/entities/appointment";

export type MyAppointments = {
  /** Confirmados que ainda vão acontecer, do mais próximo ao mais distante. */
  upcoming: Appointment[];
  /** Passados, concluídos e cancelados, do mais recente ao mais antigo. */
  history: Appointment[];
};

export type BookingForm = {
  barbershopId: string;
  serviceId: string;
  professionalId: string | null;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:mm" */
  time: string | null;
};

export interface IAppointmentUseCases {
  listMyAppointments(now?: Date): Promise<MyAppointments>;
  getNextAppointment(now?: Date): Promise<Appointment | null>;
  /** Horários livres; no dia de hoje, só os que ainda não passaram. */
  getAvailableSlots(
    barbershopId: string,
    professionalId: string,
    serviceId: string,
    date: string,
    now?: Date,
  ): Promise<string[]>;
  book(form: BookingForm, now?: Date): Promise<Appointment>;
  reschedule(appointment: Appointment, date: string, time: string | null, now?: Date): Promise<Appointment>;
  cancel(appointmentId: string): Promise<void>;
}
