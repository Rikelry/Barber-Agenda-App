import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";
import { useBarbeirosViewModel } from "@/viewmodel/useBarbeirosViewModel";
import { useDetalheBarbeariaViewModel } from "@/viewmodel/useDetalheBarbeariaViewModel";
import { usePerfilBarbeiroViewModel } from "@/viewmodel/usePerfilBarbeiroViewModel";

const mockPush = jest.fn();
let mockParams: Record<string, string> = {};
jest.mock("expo-router", () => ({
  router: { push: (...args: unknown[]) => mockPush(...args) },
  useLocalSearchParams: () => mockParams,
}));
jest.mock("@/di/container", () => ({ barbershopUseCases: {} }));

const BARBEARIA: Barbershop = { id: "b1", name: "Central", address: "Rua A", phone: "86999990000", avatarUrl: null };
const BARBEIRO: Professional = {
  id: "p1",
  barbershopId: "b1",
  name: "Zé",
  email: "ze@mail.com",
  phone: "86988880000",
  specialty: "Degradê",
  avatarUrl: null,
};

const casosFalsos = (): jest.Mocked<IBarbershopUseCases> => ({
  listBarbershops: jest.fn(async () => [BARBEARIA]),
  getBarbershopDetail: jest.fn(async () => ({ barbershop: BARBEARIA, services: [], professionals: [BARBEIRO] })),
  listBarbers: jest.fn(async () => [{ professional: BARBEIRO, barbershop: BARBEARIA }]),
  getBarberProfile: jest.fn(async () => ({ professional: BARBEIRO, barbershop: BARBEARIA, services: [] })),
});

beforeEach(() => {
  mockPush.mockClear();
  mockParams = {};
});

describe("useBarbeirosViewModel", () => {
  it("abre o perfil levando a barbearia junto", async () => {
    const casos = casosFalsos();
    const { result } = await renderHook(() => useBarbeirosViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    await act(async () => {
      result.current[1].openBarber(result.current[0].barbers[0]!);
    });
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/barbeiro/[id]",
      params: { id: "p1", barbershopId: "b1" },
    });
  });
});

describe("useDetalheBarbeariaViewModel", () => {
  it("carrega pelo id da rota e tenta de novo depois de um erro", async () => {
    mockParams = { id: "b1" };
    const casos = casosFalsos();
    casos.getBarbershopDetail.mockRejectedValueOnce(new Error("falhou"));
    const { result } = await renderHook(() => useDetalheBarbeariaViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("error"));
    expect(result.current[0].errorMessage).toBe("Erro inesperado. Tente de novo.");

    await act(async () => {
      result.current[1].retry();
    });
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(casos.getBarbershopDetail).toHaveBeenLastCalledWith("b1");
    expect(result.current[0].detail?.professionals).toEqual([BARBEIRO]);
  });
});

describe("usePerfilBarbeiroViewModel", () => {
  it("carrega o perfil e abre a barbearia", async () => {
    mockParams = { id: "p1", barbershopId: "b1" };
    const casos = casosFalsos();
    const { result } = await renderHook(() => usePerfilBarbeiroViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(casos.getBarberProfile).toHaveBeenCalledWith("b1", "p1");
    await act(async () => {
      result.current[1].openBarbershop();
    });
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/barbearia/[id]", params: { id: "b1" } });
  });

  it("link sem a barbearia mostra erro sem chamar a API", async () => {
    mockParams = { id: "p1" };
    const casos = casosFalsos();
    const { result } = await renderHook(() => usePerfilBarbeiroViewModel(casos));
    expect(result.current[0].status).toBe("error");
    expect(casos.getBarberProfile).not.toHaveBeenCalled();
  });
});
