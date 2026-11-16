import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { IProfessionalDataSource, ProfessionalIdentity } from "@/model/datasources/iProfessionalDataSource";
import { ValidationError } from "@/model/errors";
import type { IAuthSessionService } from "@/model/services/iAuthSessionService";
import type {
  AgendaItem,
  BlockField,
  DayAgenda,
  IProfessionalUseCases,
  MyBlocks,
  OneOffForm,
  RecurringBlock,
  RecurringForm,
} from "@/usecase/iProfessionalUseCases";

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
/** Faixa livre menor que isso não cabe um serviço e não aparece na agenda. */
const MENOR_FAIXA_LIVRE_MIN = 30;

const naData = (date: string, hora: string): Date => {
  const [a, m, d] = date.split("-").map(Number);
  const [h, min] = hora.split(":").map(Number);
  return new Date(a ?? 0, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0);
};

const isoDoDia = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const validarHorario = (erros: Partial<Record<BlockField, string>>, inicio: string, fim: string) => {
  if (!HORA.test(inicio)) erros.startTime = "Use o formato HH:mm.";
  if (!HORA.test(fim)) erros.endTime = "Use o formato HH:mm.";
  else if (HORA.test(inicio) && fim <= inicio) erros.endTime = "O horário final precisa ser depois do inicial.";
};

export class ProfessionalUseCases implements IProfessionalUseCases {
  private identidade: { usuarioId: string | null; promessa: Promise<ProfessionalIdentity> } | null = null;

  constructor(
    private readonly professionals: IProfessionalDataSource,
    private readonly barbershops: IBarbershopDataSource,
    private readonly session: IAuthSessionService,
  ) {}

  /** Busca uma vez por usuário logado quem é o profissional (troca de conta busca de novo). */
  private eu(): Promise<ProfessionalIdentity> {
    const usuarioId = this.session.getSession()?.user.id ?? null;
    if (!this.identidade || this.identidade.usuarioId !== usuarioId) {
      const promessa = this.professionals.getMe().catch((erro: unknown) => {
        this.identidade = null;
        throw erro;
      });
      this.identidade = { usuarioId, promessa };
    }
    return this.identidade.promessa;
  }

  async getDayAgenda(date: string): Promise<DayAgenda> {
    const eu = await this.eu();
    const dia = naData(date, "00:00");
    const [agenda, servicos, horarios] = await Promise.all([
      this.professionals.listMyAgenda(),
      this.barbershops.listServices(eu.barbershopId).catch(() => []),
      this.barbershops.listBusinessHours(eu.barbershopId).catch(() => []),
    ]);
    const nome = new Map(servicos.map((s) => [s.id, s.name]));
    const doDia = agenda
      .filter((a) => a.status !== "cancelled" && isoDoDia(a.startsAt) === date)
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    const funcionamento = horarios.find((h) => h.dayOfWeek === dia.getDay());

    const itens: AgendaItem[] = [];
    let livreDesde = funcionamento ? naData(date, funcionamento.openTime) : null;
    const fecha = funcionamento ? naData(date, funcionamento.closeTime) : null;
    const livre = (ate: Date) => {
      if (livreDesde && ate.getTime() - livreDesde.getTime() >= MENOR_FAIXA_LIVRE_MIN * 60000) {
        itens.push({ kind: "free", startsAt: livreDesde, endsAt: ate });
      }
    };
    for (const a of doDia) {
      livre(a.startsAt);
      itens.push({
        kind: "appointment",
        id: a.id,
        serviceName: nome.get(a.serviceId) ?? "Serviço",
        startsAt: a.startsAt,
        endsAt: a.endsAt,
        status: a.status,
      });
      if (livreDesde && a.endsAt > livreDesde) livreDesde = a.endsAt;
    }
    if (fecha) livre(fecha);
    return { closed: !funcionamento, items: itens };
  }

  async listMyBlocks(now: Date = new Date()): Promise<MyBlocks> {
    const eu = await this.eu();
    const [recorrentes, pontuais] = await Promise.all([
      this.professionals.listRecurringUnavailabilities(eu),
      this.professionals.listUnavailabilities(eu),
    ]);
    const grupos = new Map<string, RecurringBlock>();
    for (const r of recorrentes) {
      const key = `${r.startTime}|${r.endTime}|${r.reason ?? ""}`;
      const grupo = grupos.get(key) ?? { key, ids: [], days: [], startTime: r.startTime, endTime: r.endTime, reason: r.reason };
      grupo.ids.push(r.id);
      grupo.days.push(r.dayOfWeek);
      grupos.set(key, grupo);
    }
    // Segunda primeiro, domingo por último.
    const ordem = (d: number) => (d === 0 ? 7 : d);
    return {
      recurring: [...grupos.values()]
        .map((g) => ({ ...g, days: [...g.days].sort((a, b) => ordem(a) - ordem(b)) }))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      oneOff: pontuais
        .filter((p) => p.endsAt.getTime() >= now.getTime())
        .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime()),
    };
  }

  async addRecurringBlock(form: RecurringForm): Promise<void> {
    const erros: Partial<Record<BlockField, string>> = {};
    if (form.days.length === 0) erros.days = "Escolha pelo menos um dia.";
    validarHorario(erros, form.startTime, form.endTime);
    if (Object.keys(erros).length > 0) throw new ValidationError<BlockField>(erros);
    const eu = await this.eu();
    const motivo = form.reason.trim() || undefined;
    // A API guarda um dia por registro.
    for (const dia of form.days) {
      await this.professionals.addRecurringUnavailability(eu, dia, form.startTime, form.endTime, motivo);
    }
  }

  async addOneOffBlock(form: OneOffForm, now: Date = new Date()): Promise<void> {
    const erros: Partial<Record<BlockField, string>> = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date) || form.date < isoDoDia(now)) erros.date = "Escolha uma data a partir de hoje.";
    validarHorario(erros, form.startTime, form.endTime);
    if (Object.keys(erros).length > 0) throw new ValidationError<BlockField>(erros);
    const eu = await this.eu();
    await this.professionals.addUnavailability(
      eu,
      naData(form.date, form.startTime),
      naData(form.date, form.endTime),
      form.reason.trim() || undefined,
    );
  }

  async removeRecurringBlock(block: RecurringBlock): Promise<void> {
    const eu = await this.eu();
    for (const id of block.ids) await this.professionals.removeRecurringUnavailability(eu, id);
  }

  async removeOneOffBlock(id: string): Promise<void> {
    await this.professionals.removeUnavailability(await this.eu(), id);
  }
}
