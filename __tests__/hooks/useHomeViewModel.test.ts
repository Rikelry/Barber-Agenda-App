import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import type { BarbershopHighlight } from "@/model/entities/highlight";
import type { User } from "@/model/entities/user";
import type { IAppointmentUseCases } from "@/usecase/iAppointmentUseCases";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import type { IHomeUseCases } from "@/usecase/iHomeUseCases";
import type { IPortfolioUseCases } from "@/usecase/iPortfolioUseCases";
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
  appointmentUseCases: {},
  portfolioUseCases: {},
}));

const USUARIO: User = {
  id: "u1",
  name: "Felipe Albuquerque",
  phone: "11987654321",
  email: "f@mail.com",
  avatarUrl: null,
  memberSince: new Date(2024, 0, 1),
};
const destaque = (id: string, categories: BarbershopHighlight["categories"]): BarbershopHighlight => ({
  id,
  name: id,
  location: "Bela Vista",
  rating: null,
  reviewCount: null,
  distanceKm: null,
  imageUrl: `https://img/${id}.jpg`,
  categories,
  isOpen: true,
});
const DESTAQUES = [destaque("b1", ["cabelo"]), destaque("b2", ["barba"])];

const casosHome = (): jest.Mocked<IHomeUseCases> => ({
  getHighlights: jest.fn(async () => DESTAQUES),
  filterHighlights: jest.fn((lista: BarbershopHighlight[], categoria) =>
    lista.filter((h) => !categoria || h.categories.includes(categoria)),
  ),
});

const agenda = (): IAppointmentUseCases =>
  ({
    getNextAppointment: jest.fn(async () => ({
      id: "a1",
      barbershopId: "b2",
      barbershopName: "b2",
      professionalId: "p1",
      professionalName: "Alessandro",
      serviceId: "s1",
      serviceName: "Corte & Barba",
      durationMinutes: 60,
      startsAt: new Date(2026, 10, 25, 15),
      endsAt: new Date(2026, 10, 25, 16),
      status: "confirmed" as const,
    })),
  }) as unknown as IAppointmentUseCases;

const portfolio = { listInspirations: jest.fn(async () => []) } as unknown as IPortfolioUseCases;

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
    const home = casosHome();
    const auth = autenticado(false);
    const ag = agenda();
    await renderHook(() => useHomeViewModel(home, auth, portfolio, ag));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/login"));
    expect(home.getHighlights).not.toHaveBeenCalled();
  });

  it("carrega usuário, destaques e próximo agendamento com a foto da barbearia; filtra e navega", async () => {
    const home = casosHome();
    const auth = autenticado();
    const ag = agenda();
    const { result } = await renderHook(() => useHomeViewModel(home, auth, portfolio, ag));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].user?.name).toBe("Felipe Albuquerque");
    expect(result.current[0].category).toBeNull();
    expect(result.current[0].highlights.map((h) => h.id)).toEqual(["b1", "b2"]);
    expect(result.current[0].nextAppointment?.id).toBe("a1");
    expect(result.current[0].nextAppointmentImageUrl).toBe("https://img/b2.jpg");

    await act(async () => {
      result.current[1].selectCategory("barba");
    });
    expect(result.current[0].category).toBe("barba");
    expect(result.current[0].highlights.map((h) => h.id)).toEqual(["b2"]);
    // Tocar de novo mantém a mesma categoria; "Tudo" (null) remove o filtro.
    await act(async () => {
      result.current[1].selectCategory("barba");
    });
    expect(result.current[0].category).toBe("barba");
    await act(async () => {
      result.current[1].selectCategory(null);
    });
    expect(result.current[0].category).toBeNull();
    expect(home.getHighlights).toHaveBeenCalledTimes(1);
    await act(async () => {
      result.current[1].setSearch("b2");
    });
    expect(result.current[0].search).toBe("b2");
    expect(home.filterHighlights).toHaveBeenLastCalledWith(DESTAQUES, null, "b2");

    await act(async () => {
      result.current[1].goProfile();
      result.current[1].openAppointments();
      result.current[1].openHighlight("b1");
      result.current[1].openAllInspirations();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/perfil");
    expect(mockNavigate).toHaveBeenCalledWith("/agendamentos");
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/barbearia/[id]", params: { id: "b1" } });
    expect(mockPush).toHaveBeenCalledWith("/inspiracoes");
  });

  it("erro na primeira carga mostra o estado de erro e tenta de novo", async () => {
    const home = casosHome();
    home.getHighlights.mockRejectedValueOnce(new Error("rede"));
    const auth = autenticado();
    const ag = agenda();
    const { result } = await renderHook(() => useHomeViewModel(home, auth, portfolio, ag));
    await waitFor(() => expect(result.current[0].status).toBe("error"));
    await act(async () => {
      result.current[1].retry();
    });
    await waitFor(() => expect(result.current[0].status).toBe("content"));
  });
});
