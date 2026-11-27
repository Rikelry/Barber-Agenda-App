import { describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import type { IAgendaUseCases } from "@/usecase/iAgendaUseCases";
import type { IOwnerUseCases } from "@/usecase/iOwnerUseCases";
import { useGestaoViewModel } from "@/viewmodel/useGestaoViewModel";

import { agir } from "../helpers/authFalso";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  router: { push: (...a: unknown[]) => mockPush(...a) },
  useFocusEffect: (efeito: () => void) => require("react").useEffect(efeito, [efeito]),
  useLocalSearchParams: () => ({}),
}));
jest.mock("@/di/container", () => ({ ownerUseCases: {}, agendaUseCases: {}, authUseCases: { getSession: () => null } }));

const barbearia = (id: string, name: string) => ({ id, name, address: "Rua A", phone: "1", avatarUrl: null });

const agenda = (): jest.Mocked<IAgendaUseCases> => ({
  getOverview: jest.fn(async () => ({ requests: [], closed: false, day: [], markedDays: [] })),
  listWorkplaces: jest.fn(async () => []),
  approve: jest.fn(async () => undefined),
  reject: jest.fn(async () => undefined),
  getAvailableSlots: jest.fn(async () => []),
  propose: jest.fn(async () => undefined),
  start: jest.fn(async () => undefined),
  complete: jest.fn(async () => undefined),
  noShow: jest.fn(async () => undefined),
  cancel: jest.fn(async () => undefined),
});

describe("useGestaoViewModel", () => {
  it("abre a agenda da primeira barbearia e troca para outra", async () => {
    const dono = {
      listMyBarbershops: jest.fn(async () => [
        { barbershop: barbearia("b1", "Don Corleone"), openNow: true },
        { barbershop: barbearia("b2", "Vintage"), openNow: true },
      ]),
    } as unknown as IOwnerUseCases;
    const casos = agenda();
    const { result } = await renderHook(() => useGestaoViewModel(dono, casos));
    await waitFor(() => expect(result.current[0].agenda.status).toBe("content"));
    expect(result.current[0].selectedBarbershopId).toBe("b1");
    expect(result.current[0].agenda.showProfessional).toBe(true);
    expect(casos.getOverview).toHaveBeenLastCalledWith({ kind: "barbershop", barbershopId: "b1" }, expect.any(String));
    await agir(() => result.current[1].selectBarbershop("b2"));
    await waitFor(() =>
      expect(casos.getOverview).toHaveBeenLastCalledWith({ kind: "barbershop", barbershopId: "b2" }, expect.any(String)),
    );
  });

  it("sem barbearia mostra o convite para cadastrar e não carrega agenda", async () => {
    const dono = { listMyBarbershops: jest.fn(async () => []) } as unknown as IOwnerUseCases;
    const casos = agenda();
    const { result } = await renderHook(() => useGestaoViewModel(dono, casos));
    await waitFor(() => expect(result.current[0].barbershopsStatus).toBe("empty"));
    expect(casos.getOverview).not.toHaveBeenCalled();
    await agir(() => result.current[1].createBarbershop());
    expect(mockPush).toHaveBeenCalledWith("/minhas-barbearias/nova");
  });
});
