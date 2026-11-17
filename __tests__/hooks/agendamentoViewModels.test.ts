import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import type { Appointment } from "@/model/entities/appointment";
import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAppointmentUseCases } from "@/usecase/iAppointmentUseCases";
import type { IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";
import { useAgendamentosViewModel } from "@/viewmodel/useAgendamentosViewModel";
import { useBarbeariasViewModel } from "@/viewmodel/useBarbeariasViewModel";
import { useNovoAgendamentoViewModel } from "@/viewmodel/useNovoAgendamentoViewModel";
import { useTabBarViewModel } from "@/viewmodel/useTabBarViewModel";

import { agir } from "../helpers/authFalso";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockDismissTo = jest.fn();
let mockParams: Record<string, string> = {};
jest.mock("expo-router", () => ({
  router: {
    push: (...a: unknown[]) => mockPush(...a),
    replace: (...a: unknown[]) => mockReplace(...a),
    dismissTo: (...a: unknown[]) => mockDismissTo(...a),
    canGoBack: () => true,
    back: jest.fn(),
  },
  useLocalSearchParams: () => mockParams,
  useFocusEffect: (efeito: () => void) => require("react").useEffect(efeito, [efeito]),
}));
jest.mock("@/di/container", () => ({ appointmentUseCases: {}, barbershopUseCases: {} }));

const BARBEARIA: Barbershop = { id: "b1", name: "Don Corleone", address: "Rua A", phone: "11999990000", avatarUrl: null };
const pro = (id: string, name: string): Professional => ({ id, barbershopId: "b1", name, email: "", phone: "", specialty: null, avatarUrl: null });
const SERVICO: Service = { id: "s1", barbershopId: "b1", name: "Corte", description: null, durationMinutes: 40, price: 50, imageUrl: null };
const AGENDADO: Appointment = {
  id: "a1",
  barbershopId: "b1",
  barbershopName: "Don Corleone",
  professionalId: "p2",
  professionalName: "Lucas",
  serviceId: "s1",
  serviceName: "Corte",
  durationMinutes: 40,
  startsAt: new Date(2099, 0, 1, 15),
  endsAt: new Date(2099, 0, 1, 15, 40),
  status: "confirmed",
};

const barbeariasFalsas = (profissionais = [pro("p1", "Alessandro"), pro("p2", "Lucas")]): jest.Mocked<IBarbershopUseCases> => ({
  listBarbershops: jest.fn(async () => [BARBEARIA]),
  getBarbershopDetail: jest.fn(async () => ({ barbershop: BARBEARIA, services: [SERVICO], professionals: profissionais, hoursToday: null })),
  listBarbers: jest.fn(async () => []),
  getBarberProfile: jest.fn(async () => {
    throw new Error("não usado");
  }),
});

const agendamentosFalsos = (): jest.Mocked<IAppointmentUseCases> => ({
  listMyAppointments: jest.fn(async () => ({ upcoming: [AGENDADO], history: [] })),
  getNextAppointment: jest.fn(async () => AGENDADO),
  getAvailableSlots: jest.fn(async () => ["09:00", "15:00"]),
  book: jest.fn(async () => AGENDADO),
  reschedule: jest.fn(async () => AGENDADO),
  cancel: jest.fn(async () => undefined),
});

beforeEach(() => {
  mockPush.mockClear();
  mockReplace.mockClear();
  mockDismissTo.mockClear();
  mockParams = {};
});

describe("useTabBarViewModel", () => {
  it("troca de aba com dismissTo e ignora a aba atual", async () => {
    const { result } = await renderHook(() => useTabBarViewModel("inicio"));
    await agir(() => result.current[1].navigate("inicio"));
    await agir(() => result.current[1].navigate("agendas"));
    await agir(() => result.current[1].navigate("buscar"));
    expect(mockDismissTo.mock.calls).toEqual([["/agendamentos"], ["/barbearias"]]);
  });
});

describe("useBarbeariasViewModel", () => {
  it("carrega a lista e abre o detalhe", async () => {
    const casos = barbeariasFalsas();
    const { result } = await renderHook(() => useBarbeariasViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    await agir(() => result.current[1].openBarbershop("b1"));
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/barbearia/[id]", params: { id: "b1" } });
  });
});

describe("useNovoAgendamentoViewModel", () => {
  it("escolher profissional carrega horários; confirmar agenda e abre os agendamentos", async () => {
    mockParams = { barbershopId: "b1", serviceId: "s1" };
    const agendamentos = agendamentosFalsos();
    const barbearias = barbeariasFalsas();
    const { result } = await renderHook(() => useNovoAgendamentoViewModel(agendamentos, barbearias));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].service?.name).toBe("Corte");
    expect(result.current[0].professionalId).toBeNull();
    expect(result.current[0].slotsStatus).toBe("idle");
    expect(result.current[0].week).toHaveLength(7);

    await agir(() => result.current[1].selectProfessional("p1"));
    await waitFor(() => expect(result.current[0].slotsStatus).toBe("content"));
    expect(agendamentos.getAvailableSlots).toHaveBeenCalledWith("b1", "p1", "s1", result.current[0].date);

    await agir(() => result.current[1].selectTime("15:00"));
    await agir(() => result.current[1].confirm());
    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledWith("/agendamentos"));
    expect(agendamentos.book).toHaveBeenCalledWith({
      barbershopId: "b1",
      serviceId: "s1",
      professionalId: "p1",
      date: result.current[0].date,
      time: "15:00",
    });
  });

  it("com um profissional só ele já vem escolhido; erro de validação fica no campo", async () => {
    mockParams = { barbershopId: "b1", serviceId: "s1" };
    const agendamentos = agendamentosFalsos();
    agendamentos.book.mockRejectedValueOnce(new ValidationError({ time: "Escolha um horário." }));
    const barbearias = barbeariasFalsas([pro("p1", "Alessandro")]);
    const { result } = await renderHook(() => useNovoAgendamentoViewModel(agendamentos, barbearias));
    await waitFor(() => expect(result.current[0].slotsStatus).toBe("content"));
    expect(result.current[0].professionalId).toBe("p1");
    await agir(() => result.current[1].confirm());
    await waitFor(() => expect(result.current[0].fieldErrors.time).toBe("Escolha um horário."));
    expect(mockDismissTo).not.toHaveBeenCalled();
  });

  it("reagendar parte do agendamento existente e usa reschedule", async () => {
    mockParams = { appointmentId: "a1" };
    const agendamentos = agendamentosFalsos();
    const barbearias = barbeariasFalsas();
    const { result } = await renderHook(() => useNovoAgendamentoViewModel(agendamentos, barbearias));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].rescheduling?.id).toBe("a1");
    expect(result.current[0].professionalId).toBe("p2");
    await waitFor(() => expect(result.current[0].slotsStatus).toBe("content"));
    await agir(() => result.current[1].selectTime("09:00"));
    await agir(() => result.current[1].confirm());
    await waitFor(() => expect(agendamentos.reschedule).toHaveBeenCalledWith(AGENDADO, result.current[0].date, "09:00"));
    expect(agendamentos.book).not.toHaveBeenCalled();
  });
});

describe("useAgendamentosViewModel", () => {
  it("cancela só depois de confirmar e recarrega; reagendar abre a tela com o id", async () => {
    const casos = agendamentosFalsos();
    const { result } = await renderHook(() => useAgendamentosViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].appointments.upcoming).toHaveLength(1);

    await agir(() => result.current[1].askCancel("a1"));
    expect(result.current[0].confirmingCancelId).toBe("a1");
    expect(casos.cancel).not.toHaveBeenCalled();
    await agir(() => result.current[1].confirmCancel());
    await waitFor(() => expect(result.current[0].confirmingCancelId).toBeNull());
    expect(casos.cancel).toHaveBeenCalledWith("a1");
    expect(casos.listMyAppointments).toHaveBeenCalledTimes(2);

    await agir(() => result.current[1].reschedule(AGENDADO));
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/agendamento/novo", params: { appointmentId: "a1" } });
  });

  it("erro ao carregar mostra a mensagem do domínio", async () => {
    const casos = agendamentosFalsos();
    casos.listMyAppointments.mockRejectedValueOnce(new DomainError("Entre na sua conta para continuar.", "UNAUTHORIZED"));
    const { result } = await renderHook(() => useAgendamentosViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("error"));
    expect(result.current[0].errorMessage).toBe("Entre na sua conta para continuar.");
  });
});
