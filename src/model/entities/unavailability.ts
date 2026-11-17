/** Bloqueio pontual da agenda do profissional (ex.: exame médico). */
export type Unavailability = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  reason: string | null;
};

/** Bloqueio que se repete toda semana num dia (0 = domingo). Horas em "HH:mm". */
export type RecurringUnavailability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  reason: string | null;
};
