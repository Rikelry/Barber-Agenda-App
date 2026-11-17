import type { AppointmentData, IAppointmentDataSource } from "@/model/datasources/iAppointmentDataSource";
import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { Appointment } from "@/model/entities/appointment";
import { ValidationError } from "@/model/errors";
import type { BookingForm, IAppointmentUseCases, MyAppointments } from "@/usecase/iAppointmentUseCases";

/** "YYYY-MM-DD" da data no fuso do aparelho. */
export const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Junta "YYYY-MM-DD" e "HH:mm" numa Date local. */
export const toDateTime = (date: string, time: string): Date => {
  const [ano, mes, dia] = date.split("-").map(Number);
  const [hora, minuto] = time.split(":").map(Number);
  return new Date(ano ?? 0, (mes ?? 1) - 1, dia ?? 1, hora ?? 0, minuto ?? 0);
};

export class AppointmentUseCases implements IAppointmentUseCases {
  constructor(
    private readonly appointments: IAppointmentDataSource,
    private readonly barbershops: IBarbershopDataSource,
  ) {}

  /** Acrescenta o nome da barbearia, buscando cada barbearia uma vez só. */
  private async comBarbearia(dados: AppointmentData[]): Promise<Appointment[]> {
    const ids = [...new Set(dados.map((a) => a.barbershopId))];
    const nomes = new Map<string, string>();
    await Promise.all(
      ids.map(async (id) => {
        const barbearia = await this.barbershops.getBarbershop(id).catch(() => null);
        nomes.set(id, barbearia?.name ?? "Barbearia");
      }),
    );
    return dados.map((a) => ({ ...a, barbershopName: nomes.get(a.barbershopId) ?? "Barbearia" }));
  }

  async listMyAppointments(now: Date = new Date()): Promise<MyAppointments> {
    const todos = await this.comBarbearia(await this.appointments.listMine());
    const futuro = (a: Appointment) => a.status === "confirmed" && a.startsAt.getTime() >= now.getTime();
    return {
      upcoming: todos.filter(futuro).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime()),
      history: todos.filter((a) => !futuro(a)).sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime()),
    };
  }

  async getNextAppointment(now: Date = new Date()): Promise<Appointment | null> {
    return (await this.listMyAppointments(now)).upcoming[0] ?? null;
  }

  async getAvailableSlots(
    barbershopId: string,
    professionalId: string,
    serviceId: string,
    date: string,
    now: Date = new Date(),
  ): Promise<string[]> {
    const slots = await this.appointments.listAvailableSlots(barbershopId, professionalId, serviceId, date);
    return slots.filter((hora) => toDateTime(date, hora).getTime() > now.getTime()).sort();
  }

  /** Regras do padrão 2 de 05-padroes.md: sem datas passadas e com serviço, profissional e horário. */
  private validar(form: Pick<BookingForm, "professionalId" | "date" | "time">, now: Date) {
    const erros: Partial<Record<"professionalId" | "date" | "time", string>> = {};
    if (!form.professionalId) erros.professionalId = "Escolha o profissional.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date) || form.date < toIsoDate(now)) erros.date = "Escolha uma data a partir de hoje.";
    if (!form.time) erros.time = "Escolha um horário.";
    else if (toDateTime(form.date, form.time).getTime() <= now.getTime()) erros.time = "Esse horário já passou.";
    if (Object.keys(erros).length > 0) throw new ValidationError(erros);
  }

  async book(form: BookingForm, now: Date = new Date()): Promise<Appointment> {
    this.validar(form, now);
    const criado = await this.appointments.create({
      professionalId: form.professionalId ?? "",
      serviceId: form.serviceId,
      date: form.date,
      time: form.time ?? "",
    });
    const [comNome] = await this.comBarbearia([criado]);
    return comNome as Appointment;
  }

  async reschedule(appointment: Appointment, date: string, time: string | null, now: Date = new Date()): Promise<Appointment> {
    this.validar({ professionalId: appointment.professionalId, date, time }, now);
    const novo = await this.appointments.reschedule(appointment.id, date, time ?? "");
    return { ...novo, barbershopName: appointment.barbershopName };
  }

  cancel(appointmentId: string): Promise<void> {
    return this.appointments.cancel(appointmentId);
  }
}
