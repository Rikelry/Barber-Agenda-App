import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import type { BarbershopHighlight } from "@/model/entities/highlight";
import type { User } from "@/model/entities/user";
import type { IHomeUseCases } from "@/usecase/iHomeUseCases";
import type { IProfileUseCases } from "@/usecase/iProfileUseCases";
import { useHomeViewModel } from "@/viewmodel/useHomeViewModel";

const mockNavigate = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  router: { navigate: (...a: unknown[]) => mockNavigate(...a), push: (...a: unknown[]) => mockPush(...a) },
}));
jest.mock("@/di/container", () => ({ homeUseCases: {}, profileUseCases: {} }));

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

describe("useHomeViewModel", () => {
  it("carrega usuário, destaques de cabelo e próximo agendamento; navega pela barra", async () => {
    const home: jest.Mocked<IHomeUseCases> = {
      getHighlights: jest.fn(async () => [DESTAQUE]),
      getNextAppointment: jest.fn(async () => null),
    };
    const perfil: jest.Mocked<IProfileUseCases> = {
      getProfile: jest.fn(async () => USUARIO),
      saveProfile: jest.fn(async () => USUARIO),
    };
    const { result } = await renderHook(() => useHomeViewModel(home, perfil));
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
