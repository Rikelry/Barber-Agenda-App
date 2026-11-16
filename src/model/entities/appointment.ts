export type AppointmentStatus = "confirmed" | "pending" | "cancelled";

export type Appointment = {
  id: string;
  barbershopName: string;
  professionalName: string;
  serviceNames: string[];
  startsAt: Date;
  status: AppointmentStatus;
};
