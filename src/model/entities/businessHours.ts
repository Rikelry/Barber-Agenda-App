/** Horário de funcionamento de um dia da semana (0 = domingo). Horas em "HH:mm". */
export type BusinessHours = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
};
