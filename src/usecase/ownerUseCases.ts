import type { IBarbershopDataSource } from "@/model/datasources/iBarbershopDataSource";
import type { Address } from "@/model/entities/address";
import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";
import { DomainError, ValidationError } from "@/model/errors";
import type { LocalFile } from "@/model/services/iApiService";
import type { IAuthSessionService } from "@/model/services/iAuthSessionService";
import type { IImageStorageService } from "@/model/services/iImageStorageService";
import type {
  BarbershopField,
  BarbershopForm,
  DayHours,
  IOwnerUseCases,
  OwnedBarbershop,
  ProfessionalField,
  ProfessionalForm,
  ServiceField,
  ServiceForm,
} from "@/usecase/iOwnerUseCases";

const digitos = (t: string) => t.replace(/\D/g, "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const normalizar = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

/** Segunda a domingo, como na tela de horários. */
export const ORDEM_DA_SEMANA = [1, 2, 3, 4, 5, 6, 0];

/** "01311000" → "01311-000" */
const formatarCep = (cep: string) => {
  const d = digitos(cep);
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : cep.trim();
};

/** Monta o texto único que a API guarda: "Rua, Número - Complemento - Bairro, Cidade - UF, CEP 00000-000". */
export const formatAddress = (a: Address): string => {
  let texto = `${a.street.trim()}, ${a.number.trim()}`;
  if (a.complement.trim()) texto += ` - ${a.complement.trim()}`;
  texto += ` - ${a.neighborhood.trim()}`;
  if (a.city.trim()) texto += `, ${a.city.trim()}${a.state.trim() ? ` - ${a.state.trim().toUpperCase()}` : ""}`;
  if (digitos(a.cep)) texto += `, CEP ${formatarCep(a.cep)}`;
  return texto;
};

/** Separa o texto montado por formatAddress; se não reconhecer, deixa tudo na rua. */
export const parseAddress = (texto: string): Address => {
  const vazio: Address = { cep: "", street: texto.trim(), number: "", complement: "", neighborhood: "", city: "", state: "" };
  let resto = texto.trim();
  const cep = /,\s*CEP\s*(\d{5}-?\d{3})\s*$/i.exec(resto);
  if (cep) resto = resto.slice(0, cep.index);
  const cidade = /,\s*([^,]+?)(?:\s*-\s*([A-Za-z]{2}))?\s*$/.exec(resto);
  let city = "";
  let state = "";
  const base = /^(.+?),\s*([^,-]+?)\s+-\s+(.+)$/.exec(cidade ? resto.slice(0, cidade.index) : resto);
  if (cidade && base) {
    city = cidade[1]?.trim() ?? "";
    state = cidade[2]?.toUpperCase() ?? "";
  }
  const partes = base ?? /^(.+?),\s*([^,-]+?)\s+-\s+(.+)$/.exec(resto);
  if (!partes) return { ...vazio, cep: cep?.[1] ?? "" };
  const depoisDoNumero = (partes[3] ?? "").split(" - ");
  const neighborhood = depoisDoNumero.pop()?.trim() ?? "";
  return {
    cep: cep?.[1] ?? "",
    street: partes[1]?.trim() ?? "",
    number: partes[2]?.trim() ?? "",
    complement: depoisDoNumero.join(" - ").trim(),
    neighborhood,
    city,
    state,
  };
};

const falhar = <C extends string>(erros: Partial<Record<C, string>>) => {
  if (Object.keys(erros).length > 0) throw new ValidationError<C>(erros);
};

const validarBarbearia = (f: BarbershopForm) => {
  const e: Partial<Record<BarbershopField, string>> = {};
  if (f.name.trim().length < 3) e.name = "Informe o nome da barbearia.";
  if (digitos(f.phone).length < 10 || digitos(f.phone).length > 11) e.phone = "Informe o telefone com DDD.";
  if (digitos(f.cep) && digitos(f.cep).length !== 8) e.cep = "O CEP tem 8 números.";
  if (!f.street.trim()) e.street = "Informe a rua.";
  if (!f.number.trim()) e.number = "Informe o número.";
  if (!f.neighborhood.trim()) e.neighborhood = "Informe o bairro.";
  if (f.state.trim() && !/^[A-Za-z]{2}$/.test(f.state.trim())) e.state = "Use a sigla do estado (ex.: SP).";
  falhar(e);
};

const validarProfissional = (f: ProfessionalForm, novo: boolean) => {
  const e: Partial<Record<ProfessionalField, string>> = {};
  if (f.name.trim().length < 3) e.name = "Informe o nome completo.";
  if (digitos(f.phone).length < 10 || digitos(f.phone).length > 11) e.phone = "Informe o celular com DDD.";
  if (novo && !EMAIL.test(f.email.trim())) e.email = "Informe um e-mail válido.";
  if (novo && f.password.length < 8) e.password = "A senha precisa de pelo menos 8 caracteres.";
  falhar(e);
};

const numero = (t: string) => Number(t.replace(",", ".").replace(/[^\d.]/g, ""));

const validarServico = (f: ServiceForm) => {
  const e: Partial<Record<ServiceField, string>> = {};
  if (f.name.trim().length < 2) e.name = "Informe o nome do serviço.";
  const duracao = numero(f.durationMinutes);
  if (!Number.isInteger(duracao) || duracao < 5 || duracao > 480) e.durationMinutes = "Duração em minutos, de 5 a 480.";
  const preco = numero(f.price);
  if (!f.price.trim() || !Number.isFinite(preco) || preco <= 0) e.price = "Informe o preço.";
  falhar(e);
  return { duracao, preco };
};

const minutos = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));

export class OwnerUseCases implements IOwnerUseCases {
  constructor(
    private readonly barbershops: IBarbershopDataSource,
    private readonly images: IImageStorageService,
    private readonly session: IAuthSessionService,
  ) {}

  private usuarioId(): string {
    const id = this.session.getSession()?.user.id;
    if (!id) throw new DomainError("Entre na sua conta para continuar.", "UNAUTHORIZED");
    return id;
  }

  async listMyBarbershops(search = "", now: Date = new Date()): Promise<OwnedBarbershop[]> {
    const dono = this.usuarioId();
    const termo = normalizar(search);
    const minhas = (await this.barbershops.listBarbershops())
      .filter((b) => b.ownerId === dono)
      .filter((b) => !termo || normalizar(`${b.name} ${b.address}`).includes(termo))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    const agora = now.getHours() * 60 + now.getMinutes();
    return Promise.all(
      minhas.map(async (barbershop) => {
        const hoje = (await this.barbershops.listBusinessHours(barbershop.id).catch(() => [])).find(
          (h) => h.dayOfWeek === now.getDay(),
        );
        const openNow = Boolean(hoje) && agora >= minutos(hoje!.openTime) && agora < minutos(hoje!.closeTime);
        return { barbershop, openNow };
      }),
    );
  }

  private async enviarLogo(barbershopId: string, logo?: LocalFile | null): Promise<string | null> {
    return logo ? this.images.upload(logo, "barbershops", barbershopId) : null;
  }

  async createBarbershop(form: BarbershopForm, logo?: LocalFile | null): Promise<Barbershop> {
    validarBarbearia(form);
    const criada = await this.barbershops.createBarbershop({
      name: form.name.trim(),
      phone: digitos(form.phone),
      address: formatAddress(form),
    });
    const url = await this.enviarLogo(criada.id, logo);
    return url ? this.barbershops.updateBarbershop(criada.id, { avatarUrl: url }) : criada;
  }

  async getBarbershopForm(barbershopId: string): Promise<{ barbershop: Barbershop; form: BarbershopForm }> {
    const barbershop = await this.barbershops.getBarbershop(barbershopId);
    return { barbershop, form: { name: barbershop.name, phone: barbershop.phone, ...parseAddress(barbershop.address) } };
  }

  async updateBarbershop(barbershopId: string, form: BarbershopForm, logo?: LocalFile | null): Promise<Barbershop> {
    validarBarbearia(form);
    const url = await this.enviarLogo(barbershopId, logo);
    return this.barbershops.updateBarbershop(barbershopId, {
      name: form.name.trim(),
      phone: digitos(form.phone),
      address: formatAddress(form),
      ...(url && { avatarUrl: url }),
    });
  }

  async getWeekHours(barbershopId: string): Promise<DayHours[]> {
    const salvos = await this.barbershops.listBusinessHours(barbershopId);
    return ORDEM_DA_SEMANA.map((dia) => {
      const h = salvos.find((x) => x.dayOfWeek === dia);
      return h
        ? { dayOfWeek: dia, open: true, openTime: h.openTime, closeTime: h.closeTime }
        : { dayOfWeek: dia, open: false, openTime: "09:00", closeTime: "19:00" };
    });
  }

  async saveWeekHours(barbershopId: string, week: DayHours[]): Promise<void> {
    const erros: Record<string, string> = {};
    for (const d of week.filter((x) => x.open)) {
      if (!HORA.test(d.openTime) || !HORA.test(d.closeTime)) erros[String(d.dayOfWeek)] = "Use o formato HH:mm.";
      else if (minutos(d.closeTime) <= minutos(d.openTime)) erros[String(d.dayOfWeek)] = "O fechamento precisa ser depois da abertura.";
    }
    falhar(erros);
    // A API só cria ou atualiza dias: um dia fechado não é enviado.
    for (const d of week.filter((x) => x.open)) {
      await this.barbershops.saveBusinessHours(barbershopId, {
        dayOfWeek: d.dayOfWeek,
        openTime: d.openTime,
        closeTime: d.closeTime,
      });
    }
  }

  listProfessionals(barbershopId: string): Promise<Professional[]> {
    return this.barbershops.listProfessionals(barbershopId);
  }

  canJoinAsProfessional(): boolean {
    return !(this.session.getSession()?.roles ?? []).includes("profissional");
  }

  async joinAsProfessional(barbershopId: string, specialty = ""): Promise<Professional> {
    this.usuarioId();
    if (!this.canJoinAsProfessional()) {
      throw new DomainError("Você já atende em uma barbearia. Cada conta atende em uma só.", "VALIDATION");
    }
    const especialidade = specialty.trim();
    if (especialidade.length > 100) {
      throw new ValidationError({ specialty: "Use até 100 caracteres." });
    }
    return this.barbershops.joinAsProfessional(barbershopId, especialidade || undefined);
  }

  async addProfessional(barbershopId: string, form: ProfessionalForm): Promise<Professional> {
    validarProfissional(form, true);
    return this.barbershops.createProfessional(barbershopId, {
      name: form.name.trim(),
      phone: digitos(form.phone),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      ...(form.specialty.trim() && { specialty: form.specialty.trim() }),
    });
  }

  async updateProfessional(barbershopId: string, professionalId: string, form: ProfessionalForm): Promise<Professional> {
    validarProfissional(form, false);
    return this.barbershops.updateProfessional(barbershopId, professionalId, {
      name: form.name.trim(),
      phone: digitos(form.phone),
      specialty: form.specialty.trim(),
    });
  }

  removeProfessional(barbershopId: string, professionalId: string): Promise<void> {
    return this.barbershops.removeProfessional(barbershopId, professionalId);
  }

  listServices(barbershopId: string): Promise<Service[]> {
    return this.barbershops.listServices(barbershopId);
  }

  async addService(barbershopId: string, form: ServiceForm, photo?: LocalFile | null): Promise<Service> {
    const { duracao, preco } = validarServico(form);
    const criado = await this.barbershops.createService(barbershopId, {
      name: form.name.trim(),
      durationMinutes: duracao,
      price: preco,
      ...(form.description.trim() && { description: form.description.trim() }),
    });
    if (!photo) return criado;
    const url = await this.images.upload(photo, "services", criado.id);
    return this.barbershops.updateService(barbershopId, criado.id, { imageUrl: url });
  }

  async updateService(barbershopId: string, serviceId: string, form: ServiceForm, photo?: LocalFile | null): Promise<Service> {
    const { duracao, preco } = validarServico(form);
    const url = photo ? await this.images.upload(photo, "services", serviceId) : null;
    return this.barbershops.updateService(barbershopId, serviceId, {
      name: form.name.trim(),
      durationMinutes: duracao,
      price: preco,
      description: form.description.trim(),
      ...(url && { imageUrl: url }),
    });
  }
}
