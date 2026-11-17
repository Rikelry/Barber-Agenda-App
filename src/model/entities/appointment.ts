/**
 * Status do agendamento. A API tem "agendado", "concluido" e "cancelado"; "agendado" é um
 * horário reservado e aparece como Confirmado (padrão 7 de 05-padroes.md).
 */
export type AppointmentStatus = "confirmed" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  barbershopId: string;
  barbershopName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
};
