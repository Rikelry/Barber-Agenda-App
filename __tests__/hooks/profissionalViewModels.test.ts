import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import { ValidationError } from "@/model/errors";
import type { IProfessionalUseCases, RecurringBlock } from "@/usecase/iProfessionalUseCases";
import { useIndisponibilidadesViewModel } from "@/viewmodel/useIndisponibilidadesViewModel";
import { useMinhaAgendaViewModel } from "@/viewmodel/useMinhaAgendaViewModel";

import { agir } from "../helpers/authFalso";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  router: { push: (...a: unknown[]) => mockPush(...a), canGoBack: () => true, back: jest.fn(), replace: jest.fn() },
  useFocusEffect: (efeito: () => void) => require("react").useEffect(efeito, [efeito]),
}));
jest.mock("@/di/container", () => ({ professionalUseCases: {} }));

const BLOCO: RecurringBlock = { key: "k", ids: ["r1", "r2"], days: [1, 2], startTime: "12:00", endTime: "13:00", reason: "Almoço" };

const falso = (): jest.Mocked<IProfessionalUseCases> => ({
  getDayAgenda: jest.fn(async () => ({
    closed: false,
    items: [{ kind: "free" as const, startsAt: new Date(2026, 10, 16, 9), endsAt: new Date(2026, 10, 16, 10) }],
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

describe("useMinhaAgendaViewModel", () => {
  it("carrega hoje, troca de dia e abre as indisponibilidades", async () => {
    const casos = falso();
    const { result } = await renderHook(() => useMinhaAgendaViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].week).toHaveLength(7);
    expect(result.current[0].week[0]?.date.getDay()).toBe(1);
    expect(result.current[0].week.some((d) => d.today && d.selected)).toBe(true);
    const outro = result.current[0].week.find((d) => !d.selected)!.iso;
    await agir(() => result.current[1].selectDate(outro));
    await waitFor(() => expect(casos.getDayAgenda).toHaveBeenLastCalledWith(outro));
    await agir(() => result.current[1].openBlocks());
    expect(mockPush).toHaveBeenCalledWith("/indisponibilidades");
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
