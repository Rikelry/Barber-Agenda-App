import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import type { BarbershopHighlight } from "@/model/entities/highlight";
import type { User } from "@/model/entities/user";
import type { IHomeUseCases } from "@/usecase/iHomeUseCases";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import { useHomeViewModel } from "@/viewmodel/useHomeViewModel";

const mockNavigate = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  router: {
    navigate: (...a: unknown[]) => mockNavigate(...a),
    push: (...a: unknown[]) => mockPush(...a),
    replace: (...a: unknown[]) => mockReplace(...a),
  },
  useFocusEffect: (efeito: () => void) => require("react").useEffect(efeito, [efeito]),
}));
jest.mock("@/di/container", () => ({
  homeUseCases: {},
  authUseCases: {},
  portfolioUseCases: { listInspirations: async () => [] },
}));

const USUARIO: User = {
  id: "u1",
  name: "Felipe Albuquerque",
  phone: "11987654321",
  email: "f@mail.com",
  avatarUrl: null,
  memberSince: new Date(2024, 0, 1),
};
const DESTAQUE: BarbershopHighlight = {
  id: "b1",
  name: "Don Corleone",
  neighborhood: "Bela Vista",
  rating: 4.9,
  imageUrl: null,
  categories: ["cabelo"],
};

const autenticado = (logado = true): jest.Mocked<IAuthUseCases> => ({
  getSession: jest.fn(() => (logado ? { token: "jwt", user: USUARIO, roles: ["cliente" as const] } : null)),
  restoreSession: jest.fn(async () => (logado ? { token: "jwt", user: USUARIO, roles: ["cliente" as const] } : null)),
  login: jest.fn(async () => {
    throw new Error("não usado");
  }),
  register: jest.fn(async () => {
    throw new Error("não usado");
  }),
  requestPasswordReset: jest.fn(async () => undefined),
  resetPassword: jest.fn(async () => undefined),
  logout: jest.fn(),
  refreshSession: jest.fn(async () => null),
});

describe("useHomeViewModel", () => {
  it("sem conta entrada manda para o login", async () => {
    const home: jest.Mocked<IHomeUseCases> = {
      getHighlights: jest.fn(async () => []),
      getNextAppointment: jest.fn(async () => null),
    };
    await renderHook(() => useHomeViewModel(home, autenticado(false)));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/login"));
    expect(home.getHighlights).not.toHaveBeenCalled();
  });

  it("carrega usuário, destaques de cabelo e próximo agendamento; navega pela barra", async () => {
    const home: jest.Mocked<IHomeUseCases> = {
      getHighlights: jest.fn(async () => [DESTAQUE]),
      getNextAppointment: jest.fn(async () => null),
    };
    const auth = autenticado();
    const { result } = await renderHook(() => useHomeViewModel(home, auth));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].user?.name).toBe("Felipe Albuquerque");
    expect(home.getHighlights).toHaveBeenCalledWith("cabelo");

    await act(async () => {
      result.current[1].selectCategory("barba");
    });
    expect(home.getHighlights).toHaveBeenLastCalledWith("barba");
    await act(async () => {
      result.current[1].selectCategory("barba");
    });
    expect(result.current[0].category).toBeNull();
    expect(home.getHighlights).toHaveBeenLastCalledWith(null);

    await act(async () => {
      result.current[1].goProfile();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/perfil");
    await act(async () => {
      result.current[1].openHighlight("b1");
    });
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/barbearia/[id]", params: { id: "b1" } });
  });
});
