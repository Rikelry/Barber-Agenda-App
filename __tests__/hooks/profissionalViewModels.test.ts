import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import { ValidationError } from "@/model/errors";
import type { AgendaAppointment } from "@/model/entities/agendaAppointment";
import type { IAgendaUseCases } from "@/usecase/iAgendaUseCases";
import type { IProfessionalUseCases, RecurringBlock } from "@/usecase/iProfessionalUseCases";
import { useIndisponibilidadesViewModel } from "@/viewmodel/useIndisponibilidadesViewModel";
import { useMeuTrabalhoViewModel } from "@/viewmodel/useMeuTrabalhoViewModel";
import { useMinhaAgendaViewModel } from "@/viewmodel/useMinhaAgendaViewModel";

import { agir, authFalso } from "../helpers/authFalso";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  router: { push: (...a: unknown[]) => mockPush(...a), canGoBack: () => true, back: jest.fn(), replace: jest.fn() },
  useFocusEffect: (efeito: () => void) => require("react").useEffect(efeito, [efeito]),
}));
jest.mock("@/di/container", () => ({ professionalUseCases: {}, authUseCases: {}, agendaUseCases: {}, barbershopUseCases: {} }));

const BLOCO: RecurringBlock = { key: "k", ids: ["r1", "r2"], days: [1, 2], startTime: "12:00", endTime: "13:00", reason: "Almoço" };

const ATENDIMENTO = {
  kind: "appointment" as const,
  id: "a1",
  serviceName: "Corte",
  startsAt: new Date(2026, 10, 16, 9),
  endsAt: new Date(2026, 10, 16, 9, 30),
  status: "confirmed" as const,
};

const falso = (): jest.Mocked<IProfessionalUseCases> => ({
  getWorkplace: jest.fn(async () => ({
    barbershop: { id: "b1", name: "Don Corleone", address: "Rua A", phone: "1", avatarUrl: null },
    specialty: "Degradê",
    week: [],
    services: [],
  })),
  completeAppointment: jest.fn(async () => undefined),
  cancelAppointment: jest.fn(async () => undefined),
  getDayAgenda: jest.fn(async () => ({
    closed: false,
    items: [ATENDIMENTO, { kind: "free" as const, startsAt: new Date(2026, 10, 16, 9, 30), endsAt: new Date(2026, 10, 16, 10) }],
  })),
  listMyBlocks: jest.fn(async () => ({ recurring: [BLOCO], oneOff: [] })),
  addRecurringBlock: jest.fn(async () => undefined),
  addOneOffBlock: jest.fn(async () => undefined),
  removeRecurringBlock: jest.fn(async () => undefined),
  removeOneOffBlock: jest.fn(async () => undefined),
});

beforeEach(() => {
  mockPush.mockClear();
});

const horario = (id: string, status: AgendaAppointment["status"], startsAt: Date): AgendaAppointment => ({
  id,
  barbershopId: "b1",
  professionalId: "p1",
  professionalName: "Alessandro",
  clientName: "João Pereira",
  clientPhone: "11999990001",
  serviceId: "s1",
  serviceName: "Corte",
  durationMinutes: 30,
  startsAt,
  endsAt: new Date(startsAt.getTime() + 30 * 60000),
  status,
  proposal: null,
  rejectionReason: null,
});

const PEDIDO = horario("p1", "pending", new Date(Date.now() + 86400000));
const MARCADO = horario("a1", "confirmed", new Date(Date.now() - 600000));

const agendaFalsa = (): jest.Mocked<IAgendaUseCases> => ({
  getOverview: jest.fn(async () => ({
    requests: [PEDIDO],
    closed: false,
    day: [{ kind: "appointment" as const, appointment: MARCADO }],
    markedDays: [],
  })),
  listWorkplaces: jest.fn(async () => [
    { barbershopId: "b1", name: "Don Corleone" },
    { barbershopId: "b2", name: "Vintage" },
  ]),
  approve: jest.fn(async () => undefined),
  reject: jest.fn(async () => undefined),
  getAvailableSlots: jest.fn(async () => ["10:00", "10:30"]),
  propose: jest.fn(async () => undefined),
  start: jest.fn(async () => undefined),
  complete: jest.fn(async () => undefined),
  noShow: jest.fn(async () => undefined),
  cancel: jest.fn(async () => undefined),
});

describe("useMinhaAgendaViewModel", () => {
  it("abre a agenda da primeira barbearia, troca de dia e de barbearia e abre os bloqueios", async () => {
    const casos = agendaFalsa();
    const { result } = await renderHook(() => useMinhaAgendaViewModel(casos));
    await waitFor(() => expect(result.current[0].agenda.status).toBe("content"));
    expect(casos.getOverview).toHaveBeenCalledWith({ kind: "professional", barbershopId: "b1" }, expect.any(String));
    expect(result.current[0].workplaces).toHaveLength(2);
    const { week } = result.current[0].agenda;
    expect(week).toHaveLength(7);
    expect(week[0]?.date.getDay()).toBe(1);
    expect(week.some((d) => d.today && d.selected)).toBe(true);
    const outro = week.find((d) => !d.selected)!.iso;
    await agir(() => result.current[1].selectDate(outro));
    await waitFor(() => expect(casos.getOverview).toHaveBeenLastCalledWith({ kind: "professional", barbershopId: "b1" }, outro));
    await agir(() => result.current[1].selectBarbershop("b2"));
    await waitFor(() => expect(casos.getOverview).toHaveBeenLastCalledWith({ kind: "professional", barbershopId: "b2" }, outro));
    await agir(() => result.current[1].openBlocks());
    expect(mockPush).toHaveBeenCalledWith("/indisponibilidades");
  });
});

describe("ações na agenda", () => {
  it("aprova, recusa com motivo e sugere outro horário", async () => {
    const casos = agendaFalsa();
    const { result } = await renderHook(() => useMinhaAgendaViewModel(casos));
    await waitFor(() => expect(result.current[0].agenda.status).toBe("content"));
    await agir(() => result.current[1].approve(PEDIDO));
    await waitFor(() => expect(result.current[0].agenda.actionMessage).toBe("Pedido de João aprovado."));
    expect(casos.approve).toHaveBeenCalledWith(PEDIDO);

    await agir(() => result.current[1].askReject(PEDIDO));
    expect(casos.reject).not.toHaveBeenCalled();
    await agir(() => result.current[1].changeRejectReason("Agenda cheia"));
    await agir(() => result.current[1].confirmReject());
    await waitFor(() => expect(result.current[0].agenda.actionMessage).toBe("Pedido de João recusado."));
    expect(casos.reject).toHaveBeenCalledWith(PEDIDO, "Agenda cheia");
    expect(result.current[0].agenda.rejection).toBeNull();

    await agir(() => result.current[1].openProposal(PEDIDO));
    await waitFor(() => expect(result.current[0].agenda.proposal?.slotsStatus).toBe("content"));
    await agir(() => result.current[1].proposalSelectTime("10:30"));
    await agir(() => result.current[1].sendProposal());
    await waitFor(() => expect(result.current[0].agenda.actionMessage).toBe("Sugestão enviada para João."));
    expect(casos.propose).toHaveBeenCalledWith(PEDIDO, expect.any(String), "10:30");
    expect(result.current[0].agenda.proposal).toBeNull();
    await agir(() => result.current[1].dismissMessage());
    expect(result.current[0].agenda.actionMessage).toBeNull();
  });

  it("os detalhes iniciam e finalizam; cancelar e não compareceu pedem confirmação", async () => {
    const casos = agendaFalsa();
    const { result } = await renderHook(() => useMinhaAgendaViewModel(casos));
    await waitFor(() => expect(result.current[0].agenda.status).toBe("content"));
    await agir(() => result.current[1].openDetails(MARCADO));
    expect(result.current[0].agenda.details?.id).toBe("a1");
    await agir(() => result.current[1].start());
    await waitFor(() => expect(result.current[0].agenda.actionMessage).toBe("Atendimento de João iniciado."));
    expect(casos.start).toHaveBeenCalledWith(MARCADO);
    expect(result.current[0].agenda.details).toBeNull();

    await agir(() => result.current[1].openDetails(MARCADO));
    await agir(() => result.current[1].complete());
    await waitFor(() => expect(result.current[0].agenda.actionMessage).toBe("Atendimento finalizado."));

    await agir(() => result.current[1].openDetails(MARCADO));
    await agir(() => result.current[1].askConfirm("cancel"));
    expect(result.current[0].agenda.confirming).toBe("cancel");
    expect(casos.cancel).not.toHaveBeenCalled();
    await agir(() => result.current[1].confirm());
    await waitFor(() => expect(result.current[0].agenda.actionMessage).toBe("Horário cancelado."));
    expect(casos.cancel).toHaveBeenCalledWith(MARCADO);

    await agir(() => result.current[1].openDetails(MARCADO));
    await agir(() => result.current[1].askConfirm("no_show"));
    await agir(() => result.current[1].confirm());
    await waitFor(() => expect(casos.noShow).toHaveBeenCalledWith(MARCADO));
  });

  it("meu perfil profissional carrega o local de trabalho", async () => {
    const casos = falso();
    const { result } = await renderHook(() => useMeuTrabalhoViewModel(casos, authFalso()));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].workplace?.specialty).toBe("Degradê");
  });
});

describe("useIndisponibilidadesViewModel", () => {
  it("recorrente com dias e horas mascaradas; pontual usa a data; remover pede confirmação", async () => {
    const casos = falso();
    casos.addRecurringBlock.mockRejectedValueOnce(new ValidationError({ days: "Escolha pelo menos um dia." }));
    const { result } = await renderHook(() => useIndisponibilidadesViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].days).toEqual([1, 2, 3, 4, 5]);

    await agir(() => result.current[1].toggleDay(5));
    await agir(() => result.current[1].setStartTime("1230"));
    expect(result.current[0].startTime).toBe("12:30");
    await agir(() => result.current[1].add());
    await waitFor(() => expect(result.current[0].fieldErrors.days).toBe("Escolha pelo menos um dia."));
    await agir(() => result.current[1].add());
    await waitFor(() => expect(result.current[0].successMessage).toBe("Bloqueio adicionado."));
    expect(casos.addRecurringBlock).toHaveBeenLastCalledWith({ days: [1, 2, 3, 4], startTime: "12:30", endTime: "13:00", reason: "" });

    await agir(() => result.current[1].setTab("pontual"));
    await agir(() => result.current[1].setDate("2099-01-02"));
    await agir(() => result.current[1].add());
    await waitFor(() => expect(casos.addOneOffBlock).toHaveBeenCalledWith({ date: "2099-01-02", startTime: "12:30", endTime: "13:00", reason: "" }));

    await agir(() => result.current[1].askRemove("r:k"));
    expect(result.current[0].confirmingRemove).toBe("r:k");
    await agir(() => result.current[1].removeRecurring(BLOCO));
    await waitFor(() => expect(result.current[0].confirmingRemove).toBeNull());
    expect(casos.removeRecurringBlock).toHaveBeenCalledWith(BLOCO);
  });
});
