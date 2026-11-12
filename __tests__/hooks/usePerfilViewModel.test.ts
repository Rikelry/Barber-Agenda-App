import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import type { User } from "@/model/entities/user";
import { ValidationError } from "@/model/errors";
import type { IProfileUseCases } from "@/usecase/iProfileUseCases";
import { usePerfilViewModel } from "@/viewmodel/usePerfilViewModel";

jest.mock("expo-router", () => ({ router: { navigate: jest.fn() } }));
jest.mock("@/di/container", () => ({ profileUseCases: {} }));

const USUARIO: User = {
  id: "u1",
  name: "Felipe Albuquerque",
  phone: "11987654321",
  email: "felipe.alb@provedor.com",
  avatarUrl: null,
  memberSince: new Date(2024, 0, 15),
};

describe("usePerfilViewModel", () => {
  it("carrega o perfil com o telefone formatado e mostra erros por campo ao salvar", async () => {
    const casos: jest.Mocked<IProfileUseCases> = {
      getProfile: jest.fn(async () => USUARIO),
      saveProfile: jest.fn(async () => {
        throw new ValidationError({ name: "Informe o nome completo." });
      }),
    };
    const { result } = await renderHook(() => usePerfilViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].form.phone).toBe("(11) 98765-4321");

    await act(async () => {
      result.current[1].setField("name", "Fe");
    });
    await act(async () => {
      result.current[1].save();
    });
    await waitFor(() => expect(result.current[0].fieldErrors.name).toBe("Informe o nome completo."));
    expect(casos.saveProfile).toHaveBeenCalledWith(expect.objectContaining({ name: "Fe" }));
    expect(result.current[0].saving).toBe(false);
  });

  it("depois de salvar limpa as senhas e avisa", async () => {
    const casos: jest.Mocked<IProfileUseCases> = {
      getProfile: jest.fn(async () => USUARIO),
      saveProfile: jest.fn(async () => USUARIO),
    };
    const { result } = await renderHook(() => usePerfilViewModel(casos));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    await act(async () => {
      result.current[1].setField("newPassword", "novaSenha123");
    });
    await act(async () => {
      result.current[1].save();
    });
    await waitFor(() => expect(result.current[0].successMessage).toBe("Alterações salvas."));
    expect(result.current[0].form.newPassword).toBe("");
  });
});
