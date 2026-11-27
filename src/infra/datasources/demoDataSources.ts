// Modo demonstração (EXPO_PUBLIC_USE_MOCK=1): dados de exemplo em memória e as fontes que os
// servem, só leitura. Servem para ver o app sem backend; sem a variável, o container usa as
// fontes HTTP. Fotos de exemplo do Unsplash.

import type { AgendaScope, IAgendaDataSource } from "@/model/datasources/iAgendaDataSource";
import type { AppointmentData, BookingRequest, IAppointmentDataSource } from "@/model/datasources/iAppointmentDataSource";
import type {
  AgendaAppointmentData,
  IProfessionalDataSource,
  ProfessionalIdentity,
} from "@/model/datasources/iProfessionalDataSource";
import type { AgendaAppointment } from "@/model/entities/agendaAppointment";
import type { Barbershop } from "@/model/entities/barbershop";
import type { BusinessHours } from "@/model/entities/businessHours";
import type { IAuthDataSource } from "@/model/datasources/iAuthDataSource";
import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { IPortfolioDataSource } from "@/model/datasources/iPortfolioDataSource";
import type { IUserDataSource, ProfileUpdate } from "@/model/datasources/iUserDataSource";
import type { User } from "@/model/entities/user";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";
import type { Session } from "@/model/entities/session";
import type { RecurringUnavailability, Unavailability } from "@/model/entities/unavailability";
import { DomainError } from "@/model/errors";

const foto = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80`;

export const demoAtraso = () => new Promise((resolve) => setTimeout(resolve, 250));

export const demoSomenteLeitura = () =>
  new DomainError("Indisponível no modo demonstração.", "SERVER");

export const DEMO_SESSION: Session = {
  token: "demo",
  roles: ["cliente"],
  user: {
    id: "demo-felipe",
    name: "Felipe Albuquerque",
    phone: "11987654321",
    email: "felipe@demo.app",
    avatarUrl: null,
    memberSince: new Date(2024, 0, 15),
  },
};

/** Barbeiro de exemplo (Alessandro, da Don Corleone): entra com e-mail que começa com "barbeiro". */
export const DEMO_BARBER_SESSION: Session = {
  token: "demo-barbeiro",
  roles: ["cliente", "profissional"],
  user: {
    id: "demo-alessandro-usuario",
    name: "Alessandro",
    phone: "11911112222",
    email: "barbeiro@demo.app",
    avatarUrl: null,
    memberSince: new Date(2024, 2, 10),
  },
};

/** Dono de barbearia de exemplo: entra com um e-mail que começa com "dono" (ex.: dono@demo.app). */
export const DEMO_OWNER_SESSION: Session = {
  token: "demo-dono",
  roles: ["cliente", "owner"],
  user: {
    id: "demo-dono",
    name: "Ricardo Moura",
    phone: "11955554444",
    email: "dono@demo.app",
    avatarUrl: null,
    memberSince: new Date(2023, 5, 2),
  },
};

export const DEMO_BARBERSHOPS: Barbershop[] = [
  {
    id: "demo-don-corleone",
    name: "Barbearia Don Corleone",
    address: "Rua Bela Vista, 412 - Bela Vista",
    phone: "11987654321",
    avatarUrl: foto("photo-1585747860715-2ba37e788b70"),
    ownerId: "demo-dono",
  },
  {
    id: "demo-vintage",
    name: "Vintage Cut Club",
    address: "Av. Pinheiros, 1024 - Pinheiros",
    phone: "11976543210",
    avatarUrl: foto("photo-1512690459411-b9245aed614b"),
    ownerId: "demo-dono",
  },
  {
    id: "demo-imperador",
    name: "Imperador da Barba",
    address: "Rua Augusta, 87 - Consolação",
    phone: "11965432109",
    avatarUrl: foto("photo-1605497788044-5a32c7078486"),
  },
];

const servico = (
  barbershopId: string,
  id: string,
  name: string,
  durationMinutes: number,
  price: number,
  description: string,
  unsplash: string,
): Service => ({
  id: `${barbershopId}-${id}`,
  barbershopId,
  name,
  description,
  durationMinutes,
  price,
  imageUrl: foto(unsplash),
});

export const DEMO_SERVICES: Service[] = [
  servico("demo-don-corleone", "barboterapia", "Barboterapia Completa", 30, 40, "Cuidados completos para sua barba e pele.", "photo-1532710093739-9470acff878f"),
  servico("demo-don-corleone", "corte", "Corte de Cabelo Masculino", 40, 50, "Estilo e precisão em cada detalhe.", "photo-1622286342621-4bd786c2447c"),
  servico("demo-don-corleone", "combo", "Combo Imperial (Corte + Barba)", 60, 80, "O pacote completo para você.", "photo-1503951914875-452162b0f3f1"),
  servico("demo-vintage", "corte", "Corte Degradê", 45, 60, "Degradê na máquina com acabamento na navalha.", "photo-1567894340315-735d7c361db0"),
  servico("demo-vintage", "sobrancelha", "Design de Sobrancelha", 20, 25, "Limpeza e desenho na navalha.", "photo-1593702288056-7927b442d0fa"),
  servico("demo-vintage", "combo", "Combo Vintage (Corte + Barba)", 75, 95, "Corte, barba e toalha quente.", "photo-1599351431202-1e0f0137899a"),
  servico("demo-imperador", "barba", "Barba de Navalha", 30, 45, "Barba alinhada com toalha quente.", "photo-1621605815971-fbc98d665033"),
  servico("demo-imperador", "sobrancelha", "Sobrancelha", 15, 20, "Acabamento rápido e natural.", "photo-1590540179852-2110a54f813a"),
];

/** Abertas todos os dias das 8h às 22h, menos o Imperador (só aos domingos: aparece fechado). */
const todoDia = (abre: string, fecha: string): BusinessHours[] =>
  [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({ dayOfWeek, openTime: abre, closeTime: fecha }));

export const DEMO_HOURS: Record<string, BusinessHours[]> = {
  "demo-don-corleone": todoDia("08:00", "22:00"),
  "demo-vintage": todoDia("08:00", "22:00"),
  "demo-imperador": [{ dayOfWeek: 0, openTime: "09:00", closeTime: "13:00" }],
};

export const DEMO_PROFESSIONALS: Professional[] = [
  {
    id: "demo-alessandro",
    barbershopId: "demo-don-corleone",
    name: "Alessandro",
    email: "alessandro@demo.app",
    phone: "11911112222",
    specialty: "Cortes clássicos e barba",
    avatarUrl: null,
  },
  {
    // O mesmo Alessandro também atende na Vintage (um vínculo por barbearia).
    id: "demo-alessandro-vintage",
    barbershopId: "demo-vintage",
    name: "Alessandro",
    email: "alessandro@demo.app",
    phone: "11911112222",
    specialty: "Cortes clássicos e barba",
    avatarUrl: null,
  },
  {
    id: "demo-rafael",
    barbershopId: "demo-vintage",
    name: "Rafael",
    email: "rafael@demo.app",
    phone: "11933334444",
    specialty: "Degradê e texturizado",
    avatarUrl: null,
  },
];

type DemoAgendamento = AgendaAppointment & { clientId: string };

/** Dia de hoje + n, na hora "HH:mm". */
const emDias = (n: number, hora: string) => {
  const [h, m] = hora.split(":").map(Number);
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d;
};

const CLIENTES: Record<string, { name: string; phone: string }> = {
  "demo-felipe": { name: "Felipe Albuquerque", phone: "11987654321" },
  "demo-joao": { name: "João Pereira", phone: "11999990001" },
  "demo-marcos": { name: "Marcos Lima", phone: "11999990002" },
  "demo-pedro": { name: "Pedro Santos", phone: "11999990003" },
  "demo-lucas": { name: "Lucas Rocha", phone: "11999990004" },
  "demo-andre": { name: "André Costa", phone: "11999990005" },
};

let sequencia = 0;
const novoAgendamento = (
  clientId: string,
  professionalId: string,
  serviceId: string,
  startsAt: Date,
  status: AgendaAppointment["status"],
): DemoAgendamento => {
  const servico = DEMO_SERVICES.find((x) => x.id === serviceId);
  const profissional = DEMO_PROFESSIONALS.find((p) => p.id === professionalId);
  const duracao = servico?.durationMinutes ?? 30;
  return {
    id: `demo-agendamento-${++sequencia}`,
    clientId,
    clientName: CLIENTES[clientId]?.name ?? "Cliente",
    clientPhone: CLIENTES[clientId]?.phone ?? "",
    barbershopId: profissional?.barbershopId ?? "",
    professionalId,
    professionalName: profissional?.name ?? "",
    serviceId,
    serviceName: servico?.name ?? "Serviço",
    durationMinutes: duracao,
    startsAt,
    endsAt: new Date(startsAt.getTime() + duracao * 60000),
    status,
    proposal: null,
    rejectionReason: null,
  };
};

/**
 * Agendamentos do modo demonstração, em memória: o cliente pede, o barbeiro ou o dono respondem.
 * Some ao recarregar o app.
 */
const AGENDA: DemoAgendamento[] = [
  novoAgendamento("demo-felipe", "demo-alessandro", "demo-don-corleone-combo", emDias(1, "15:00"), "confirmed"),
  novoAgendamento("demo-lucas", "demo-alessandro", "demo-don-corleone-corte", emDias(0, "09:00"), "completed"),
  novoAgendamento("demo-andre", "demo-alessandro", "demo-don-corleone-barboterapia", emDias(0, "10:00"), "confirmed"),
  novoAgendamento("demo-joao", "demo-alessandro", "demo-don-corleone-corte", emDias(0, "18:00"), "pending"),
  novoAgendamento("demo-marcos", "demo-alessandro", "demo-don-corleone-barboterapia", emDias(1, "10:30"), "pending"),
  novoAgendamento("demo-pedro", "demo-rafael", "demo-vintage-corte", emDias(1, "11:00"), "pending"),
  novoAgendamento("demo-andre", "demo-rafael", "demo-vintage-combo", emDias(2, "16:00"), "confirmed"),
  novoAgendamento("demo-lucas", "demo-alessandro-vintage", "demo-vintage-corte", emDias(1, "14:00"), "pending"),
  novoAgendamento("demo-marcos", "demo-alessandro-vintage", "demo-vintage-sobrancelha", emDias(0, "17:00"), "confirmed"),
  novoAgendamento("demo-felipe", "demo-rafael", "demo-vintage-corte", emDias(2, "11:00"), "pending"),
];

const ativo = (a: DemoAgendamento) =>
  a.status === "pending" || a.status === "awaiting_client" || a.status === "confirmed" || a.status === "in_progress";

const buscar = (id: string) => {
  const agendamento = AGENDA.find((a) => a.id === id);
  if (!agendamento) throw new DomainError("Agendamento não encontrado.", "NOT_FOUND");
  return agendamento;
};

const naDataHora = (date: string, time: string) => {
  const [ano, mes, dia] = date.split("-").map(Number);
  const [h, m] = time.split(":").map(Number);
  return new Date(ano ?? 0, (mes ?? 1) - 1, dia ?? 1, h ?? 0, m ?? 0);
};

/** Horários de 30 em 30 min dentro do funcionamento que não batem com outro agendamento ativo. */
const horariosLivres = (barbershopId: string, professionalId: string, serviceId: string, date: string, ignorar?: string) => {
  const dia = naDataHora(date, "00:00").getDay();
  const funcionamento = (DEMO_HOURS[barbershopId] ?? []).find((h) => h.dayOfWeek === dia);
  if (!funcionamento) return [];
  const duracao = (DEMO_SERVICES.find((x) => x.id === serviceId)?.durationMinutes ?? 30) * 60000;
  const fim = naDataHora(date, funcionamento.closeTime).getTime();
  const livres: string[] = [];
  for (let t = naDataHora(date, funcionamento.openTime).getTime(); t + duracao <= fim; t += 30 * 60000) {
    const ocupado = AGENDA.some(
      (a) =>
        a.id !== ignorar &&
        a.professionalId === professionalId &&
        ((ativo(a) && a.startsAt.getTime() < t + duracao && a.endsAt.getTime() > t) ||
          // O horário sugerido ao cliente também fica reservado.
          (a.status === "awaiting_client" &&
            a.proposal !== null &&
            a.proposal.startsAt.getTime() < t + duracao &&
            a.proposal.endsAt.getTime() > t)),
    );
    const d = new Date(t);
    if (!ocupado) livres.push(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
  }
  return livres;
};

const remarcar = (id: string, date: string, time: string) => {
  const agendamento = buscar(id);
  if (!horariosLivres(agendamento.barbershopId, agendamento.professionalId, agendamento.serviceId, date, id).includes(time)) {
    throw new DomainError("Horário indisponível para este profissional.", "VALIDATION");
  }
  agendamento.startsAt = naDataHora(date, time);
  agendamento.endsAt = new Date(agendamento.startsAt.getTime() + agendamento.durationMinutes * 60000);
  return agendamento;
};

const paraCliente = ({ clientId: _c, clientName: _n, clientPhone: _p, ...a }: DemoAgendamento): AppointmentData => ({ ...a });

/** Cliente de exemplo logado no momento (o dono e o barbeiro também agendam como cliente). */
let clienteAtual = "demo-felipe";

/** Sessão de exemplo logada (o Perfil mostra o usuário dela). */
let sessaoAtual: Session = DEMO_SESSION;

type Vinculo = { professionalId: string; barbershopId: string; specialty: string | null };

/** Usuário → vínculos de profissional (um por barbearia onde atende). */
const PROFISSIONAL_DO_USUARIO: Record<string, Vinculo[]> = {
  "demo-alessandro-usuario": [
    { professionalId: "demo-alessandro", barbershopId: "demo-don-corleone", specialty: "Cortes clássicos e barba" },
    { professionalId: "demo-alessandro-vintage", barbershopId: "demo-vintage", specialty: "Cortes clássicos e barba" },
  ],
};

/** Vínculos do profissional logado (barbeiro, ou o dono depois de passar a atender). */
let vinculosAtuais: Vinculo[] = [];

/** O vínculo do profissional logado na barbearia (ou o primeiro); quem não atende não tem agenda. */
const euProfissional = (barbershopId?: string): Vinculo => {
  const vinculo = barbershopId ? vinculosAtuais.find((v) => v.barbershopId === barbershopId) : vinculosAtuais[0];
  if (!vinculo) throw new DomainError("Você ainda não atende nesta barbearia.", "NOT_FOUND");
  return vinculo;
};

const inspiracao = (id: string, caption: string, unsplash: string, professionalId: string, barbershopId: string): PortfolioPhoto => ({
  id,
  professionalId,
  professionalName: professionalId === "demo-alessandro" ? "Alessandro" : "Rafael",
  barbershopId,
  imageUrl: foto(unsplash),
  caption,
  serviceId: null,
  serviceName: null,
  featured: true,
  createdAt: new Date(2026, 10, 20),
});

export const DEMO_PORTFOLIO: PortfolioPhoto[] = [
  inspiracao("demo-foto-1", "Low Fade", "photo-1599351431202-1e0f0137899a", "demo-alessandro", "demo-don-corleone"),
  inspiracao("demo-foto-2", "Texturizado", "photo-1622286342621-4bd786c2447c", "demo-rafael", "demo-vintage"),
  inspiracao("demo-foto-3", "Barba Moderna", "photo-1532710093739-9470acff878f", "demo-alessandro", "demo-don-corleone"),
  inspiracao("demo-foto-4", "Degradê", "photo-1567894340315-735d7c361db0", "demo-rafael", "demo-vintage"),
  inspiracao("demo-foto-5", "Corte Social", "photo-1590540179852-2110a54f813a", "demo-alessandro", "demo-don-corleone"),
  inspiracao("demo-foto-6", "Degradê", "photo-1567894340315-735d7c361db0", "demo-alessandro", "demo-don-corleone"),
  inspiracao("demo-foto-7", "Texturizado", "photo-1622286342621-4bd786c2447c", "demo-alessandro", "demo-don-corleone"),
];

/**
 * Modo demonstração: qualquer senha serve. E-mail começando com "dono" entra como o dono de
 * exemplo (Don Corleone e Vintage Cut Club); os demais, como o cliente de exemplo.
 */
export class DemoAuthDataSource implements IAuthDataSource {
  private atual: Session = DEMO_SESSION;

  async login(email: string): Promise<Session> {
    await demoAtraso();
    const e = email.trim().toLowerCase();
    this.atual = e.startsWith("dono") ? DEMO_OWNER_SESSION : e.startsWith("barbeiro") ? DEMO_BARBER_SESSION : DEMO_SESSION;
    clienteAtual = this.atual === DEMO_SESSION ? "demo-felipe" : this.atual.user.id;
    vinculosAtuais = PROFISSIONAL_DO_USUARIO[this.atual.user.id] ?? [];
    sessaoAtual = this.atual;
    return this.atual;
  }

  async register(): Promise<void> {
    throw demoSomenteLeitura();
  }

  async requestPasswordReset(): Promise<void> {
    throw demoSomenteLeitura();
  }

  async resetPassword(): Promise<void> {
    throw demoSomenteLeitura();
  }

  async refreshToken(): Promise<Session> {
    return this.atual;
  }
}

/** Modo demonstração: barbearias, serviços, profissionais e horários de exemplo (só leitura). */

const naoEncontrada = () => new DomainError("Não encontrado.", "NOT_FOUND");

export class DemoBarbershopDataSource implements IBarbershopDataSource {
  async listBarbershops(): Promise<Barbershop[]> {
    await demoAtraso();
    return DEMO_BARBERSHOPS.map((b) => ({ ...b }));
  }

  async getBarbershop(id: string): Promise<Barbershop> {
    await demoAtraso();
    const barbearia = DEMO_BARBERSHOPS.find((b) => b.id === id);
    if (!barbearia) throw naoEncontrada();
    return { ...barbearia };
  }

  async listProfessionals(barbershopId: string): Promise<Professional[]> {
    return DEMO_PROFESSIONALS.filter((p) => p.barbershopId === barbershopId);
  }

  async getProfessional(barbershopId: string, professionalId: string): Promise<Professional> {
    const profissional = DEMO_PROFESSIONALS.find((p) => p.barbershopId === barbershopId && p.id === professionalId);
    if (!profissional) throw naoEncontrada();
    return profissional;
  }

  async listServices(barbershopId: string): Promise<Service[]> {
    return DEMO_SERVICES.filter((s) => s.barbershopId === barbershopId);
  }

  async listBusinessHours(barbershopId: string): Promise<BusinessHours[]> {
    return DEMO_HOURS[barbershopId] ?? [];
  }

  async createBarbershop(): Promise<Barbershop> {
    throw demoSomenteLeitura();
  }

  async updateBarbershop(): Promise<Barbershop> {
    throw demoSomenteLeitura();
  }

  async saveBusinessHours(): Promise<void> {
    throw demoSomenteLeitura();
  }

  async createProfessional(): Promise<Professional> {
    throw demoSomenteLeitura();
  }

  async joinAsProfessional(barbershopId: string, specialty?: string): Promise<Professional> {
    await demoAtraso();
    const dono = DEMO_OWNER_SESSION.user;
    const atuais = PROFISSIONAL_DO_USUARIO[dono.id] ?? [];
    if (atuais.some((v) => v.barbershopId === barbershopId)) throw new DomainError("Você já atende nesta barbearia.", "VALIDATION");
    const profissional: Professional = {
      id: `demo-ricardo-${barbershopId}`,
      barbershopId,
      name: dono.name,
      email: dono.email,
      phone: dono.phone,
      specialty: specialty ?? null,
      avatarUrl: null,
    };
    DEMO_PROFESSIONALS.push(profissional);
    PROFISSIONAL_DO_USUARIO[dono.id] = [...atuais, { professionalId: profissional.id, barbershopId, specialty: profissional.specialty }];
    vinculosAtuais = PROFISSIONAL_DO_USUARIO[dono.id] ?? [];
    // Lista nova (não altera a antiga): as telas comparam os papéis para saber se mudaram.
    if (!DEMO_OWNER_SESSION.roles.includes("profissional")) DEMO_OWNER_SESSION.roles = [...DEMO_OWNER_SESSION.roles, "profissional"];
    return profissional;
  }

  async updateProfessional(): Promise<Professional> {
    throw demoSomenteLeitura();
  }

  async removeProfessional(): Promise<void> {
    throw demoSomenteLeitura();
  }

  async createService(): Promise<Service> {
    throw demoSomenteLeitura();
  }

  async updateService(): Promise<Service> {
    throw demoSomenteLeitura();
  }
}

/** Modo demonstração: agendamentos do cliente logado; pedir um horário cria um pedido pendente. */
export class DemoAppointmentDataSource implements IAppointmentDataSource {
  async listMine(): Promise<AppointmentData[]> {
    await demoAtraso();
    return AGENDA.filter((a) => a.clientId === clienteAtual).map(paraCliente);
  }

  async create(request: BookingRequest): Promise<AppointmentData> {
    await demoAtraso();
    const profissional = DEMO_PROFESSIONALS.find((p) => p.id === request.professionalId);
    const livres = horariosLivres(profissional?.barbershopId ?? "", request.professionalId, request.serviceId, request.date);
    if (!livres.includes(request.time)) throw new DomainError("Horário indisponível para este profissional.", "VALIDATION");
    const agendamento = novoAgendamento(
      clienteAtual,
      request.professionalId,
      request.serviceId,
      naDataHora(request.date, request.time),
      "pending",
    );
    AGENDA.push(agendamento);
    return paraCliente(agendamento);
  }

  async cancel(appointmentId: string): Promise<void> {
    buscar(appointmentId).status = "cancelled";
  }

  async acceptProposal(appointmentId: string): Promise<void> {
    const a = buscar(appointmentId);
    if (a.status !== "awaiting_client" || !a.proposal) throw new DomainError("Não há horário sugerido.", "VALIDATION");
    a.startsAt = a.proposal.startsAt;
    a.endsAt = a.proposal.endsAt;
    a.proposal = null;
    a.status = "confirmed";
  }

  async rejectProposal(appointmentId: string): Promise<void> {
    const a = buscar(appointmentId);
    if (a.status !== "awaiting_client") throw new DomainError("Não há horário sugerido.", "VALIDATION");
    a.proposal = null;
    a.status = "cancelled";
  }

  async reschedule(appointmentId: string, date: string, time: string): Promise<AppointmentData> {
    return paraCliente(remarcar(appointmentId, date, time));
  }

  async listAvailableSlots(barbershopId: string, professionalId: string, serviceId: string, date: string): Promise<string[]> {
    return horariosLivres(barbershopId, professionalId, serviceId, date);
  }
}

/** Modo demonstração: agendas do profissional logado e das barbearias do dono, com respostas. */
export class DemoAgendaDataSource implements IAgendaDataSource {
  async list(scope: AgendaScope): Promise<AgendaAppointment[]> {
    await demoAtraso();
    // Na agenda do profissional, só os dele (na barbearia escolhida ou em todas).
    const meus = scope.kind === "professional" ? vinculosAtuais.filter((v) => !scope.barbershopId || v.barbershopId === scope.barbershopId) : [];
    return AGENDA.filter((a) =>
      scope.kind === "professional" ? meus.some((v) => v.professionalId === a.professionalId) : a.barbershopId === scope.barbershopId,
    ).map(({ clientId: _c, ...a }) => ({ ...a }));
  }

  async propose(appointmentId: string, date: string, time: string): Promise<void> {
    const a = buscar(appointmentId);
    if (a.status !== "pending") throw new DomainError("Só dá para sugerir horário a um pedido pendente.", "VALIDATION");
    if (!horariosLivres(a.barbershopId, a.professionalId, a.serviceId, date, a.id).includes(time)) {
      throw new DomainError("Horário indisponível para este profissional.", "VALIDATION");
    }
    const inicio = naDataHora(date, time);
    a.proposal = { startsAt: inicio, endsAt: new Date(inicio.getTime() + a.durationMinutes * 60000) };
    a.status = "awaiting_client";
  }

  async start(appointmentId: string): Promise<void> {
    buscar(appointmentId).status = "in_progress";
  }

  async noShow(appointmentId: string): Promise<void> {
    buscar(appointmentId).status = "no_show";
  }

  async approve(appointmentId: string): Promise<void> {
    buscar(appointmentId).status = "confirmed";
  }

  async reject(appointmentId: string, reason?: string): Promise<void> {
    const a = buscar(appointmentId);
    a.status = "rejected";
    a.rejectionReason = reason?.trim() || null;
  }

  async complete(appointmentId: string): Promise<void> {
    buscar(appointmentId).status = "completed";
  }

  async cancel(appointmentId: string): Promise<void> {
    buscar(appointmentId).status = "cancelled";
  }

  async reschedule(appointmentId: string, date: string, time: string): Promise<void> {
    remarcar(appointmentId, date, time);
  }

  async listAvailableSlots(barbershopId: string, professionalId: string, serviceId: string, date: string): Promise<string[]> {
    return horariosLivres(barbershopId, professionalId, serviceId, date);
  }
}

/** Modo demonstração: o profissional logado (Alessandro, ou o dono que passou a atender) e os bloqueios, em memória. */
export class DemoProfessionalDataSource implements IProfessionalDataSource {
  private pontuais: Unavailability[] = [];
  private recorrentes: RecurringUnavailability[] = [];

  async getMe(barbershopId?: string): Promise<ProfessionalIdentity> {
    return { ...euProfissional(barbershopId) };
  }

  async listMyWorkplaces(): Promise<ProfessionalIdentity[]> {
    return vinculosAtuais.map((v) => ({ ...v }));
  }

  async listMyAgenda(): Promise<AgendaAppointmentData[]> {
    return AGENDA.filter((a) => vinculosAtuais.some((v) => v.professionalId === a.professionalId)).map((a) => ({
      id: a.id,
      serviceId: a.serviceId,
      startsAt: a.startsAt,
      endsAt: a.endsAt,
      status: a.status,
    }));
  }

  async completeAppointment(appointmentId: string): Promise<void> {
    buscar(appointmentId).status = "completed";
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    buscar(appointmentId).status = "cancelled";
  }

  async listUnavailabilities(): Promise<Unavailability[]> {
    return [...this.pontuais];
  }

  async addUnavailability(_who: ProfessionalIdentity, startsAt: Date, endsAt: Date, reason?: string): Promise<void> {
    this.pontuais.push({ id: `demo-bloqueio-${++sequencia}`, startsAt, endsAt, reason: reason ?? null });
  }

  async removeUnavailability(_who: ProfessionalIdentity, id: string): Promise<void> {
    this.pontuais = this.pontuais.filter((b) => b.id !== id);
  }

  async listRecurringUnavailabilities(): Promise<RecurringUnavailability[]> {
    return [...this.recorrentes];
  }

  async addRecurringUnavailability(
    _who: ProfessionalIdentity,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    reason?: string,
  ): Promise<void> {
    this.recorrentes.push({ id: `demo-recorrente-${++sequencia}`, dayOfWeek, startTime, endTime, reason: reason ?? null });
  }

  async removeRecurringUnavailability(_who: ProfessionalIdentity, id: string): Promise<void> {
    this.recorrentes = this.recorrentes.filter((b) => b.id !== id);
  }
}

/** Modo demonstração: fotos de cortes de exemplo para as Inspirações (só leitura). */
export class DemoPortfolioDataSource implements IPortfolioDataSource {
  async listMine(): Promise<PortfolioPhoto[]> {
    return [];
  }

  async listByProfessional(professionalId: string): Promise<PortfolioPhoto[]> {
    return DEMO_PORTFOLIO.filter((f) => f.professionalId === professionalId);
  }

  async listByBarbershop(barbershopId: string): Promise<PortfolioPhoto[]> {
    return DEMO_PORTFOLIO.filter((f) => f.barbershopId === barbershopId);
  }

  async listFeatured(): Promise<PortfolioPhoto[]> {
    await demoAtraso();
    return DEMO_PORTFOLIO;
  }

  async publish(): Promise<PortfolioPhoto> {
    throw demoSomenteLeitura();
  }

  async remove(): Promise<void> {
    throw demoSomenteLeitura();
  }
}

/** Modo demonstração: os dados pessoais de quem está logado (cliente, barbeiro ou dono). */
export class DemoUserDataSource implements IUserDataSource {
  async getCurrentUser(): Promise<User> {
    await demoAtraso();
    return { ...sessaoAtual.user };
  }

  async updateProfile(update: ProfileUpdate): Promise<User> {
    await demoAtraso();
    sessaoAtual.user = { ...sessaoAtual.user, name: update.name, phone: update.phone };
    return { ...sessaoAtual.user };
  }

  async changePassword(): Promise<void> {
    throw demoSomenteLeitura();
  }
}
