import type { Address } from "@/model/entities/address";
import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";
import type { LocalFile } from "@/model/services/iApiService";

export type OwnedBarbershop = { barbershop: Barbershop; openNow: boolean };

export type BarbershopForm = { name: string; phone: string } & Address;
export type BarbershopField = keyof BarbershopForm;

/** Um dia da semana na tela de horários (0 = domingo). */
export type DayHours = { dayOfWeek: number; open: boolean; openTime: string; closeTime: string };

export type ProfessionalForm = { name: string; phone: string; email: string; password: string; specialty: string };
export type ProfessionalField = keyof ProfessionalForm;

export type ServiceForm = { name: string; description: string; durationMinutes: string; price: string };
export type ServiceField = keyof ServiceForm;

export interface IOwnerUseCases {
  /** Barbearias do usuário logado, com o status de agora (aberta ou fechada). */
  listMyBarbershops(search?: string, now?: Date): Promise<OwnedBarbershop[]>;
  /** Cria a barbearia (e envia o logo, se houver); o usuário passa a ser dono. */
  createBarbershop(form: BarbershopForm, logo?: LocalFile | null): Promise<Barbershop>;
  getBarbershopForm(barbershopId: string): Promise<{ barbershop: Barbershop; form: BarbershopForm }>;
  updateBarbershop(barbershopId: string, form: BarbershopForm, logo?: LocalFile | null): Promise<Barbershop>;
  /** Os 7 dias, de segunda a domingo; dias sem horário vêm fechados. */
  getWeekHours(barbershopId: string): Promise<DayHours[]>;
  saveWeekHours(barbershopId: string, week: DayHours[]): Promise<void>;
  listProfessionals(barbershopId: string): Promise<Professional[]>;
  addProfessional(barbershopId: string, form: ProfessionalForm): Promise<Professional>;
  /** O dono ainda não atende em nenhuma barbearia (pode passar a atender nesta). */
  canJoinAsProfessional(): boolean;
  /**
   * O dono passa a atender na própria barbearia, com a mesma conta: ganha a agenda e os
   * pedidos de horário como qualquer profissional. Só dá para atender em uma barbearia.
   */
  joinAsProfessional(barbershopId: string, specialty?: string): Promise<Professional>;
  /** Na edição a senha e o e-mail não mudam. */
  updateProfessional(barbershopId: string, professionalId: string, form: ProfessionalForm): Promise<Professional>;
  removeProfessional(barbershopId: string, professionalId: string): Promise<void>;
  listServices(barbershopId: string): Promise<Service[]>;
  /** Com foto, envia a imagem depois de criar e grava a URL no serviço. */
  addService(barbershopId: string, form: ServiceForm, photo?: LocalFile | null): Promise<Service>;
  updateService(barbershopId: string, serviceId: string, form: ServiceForm, photo?: LocalFile | null): Promise<Service>;
}
