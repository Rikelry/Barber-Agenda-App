import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import { DomainError, ValidationError } from "@/model/errors";
import { useRecuperarSenhaViewModel } from "@/viewmodel/useRecuperarSenhaViewModel";
import { useRedefinirSenhaViewModel } from "@/viewmodel/useRedefinirSenhaViewModel";

import { agir, authFalso } from "../helpers/authFalso";

const mockReplace = jest.fn();
const mockDismissTo = jest.fn();
let mockParams: Record<string, string> = {};
jest.mock("expo-router", () => ({
  router: { replace: (...a: unknown[]) => mockReplace(...a), dismissTo: (...a: unknown[]) => mockDismissTo(...a) },
  useLocalSearchParams: () => mockParams,
}));
jest.mock("@/di/container", () => ({ authUseCases: {} }));

beforeEach(() => {
  mockReplace.mockClear();
  mockDismissTo.mockClear();
  mockParams = {};
});

describe("useRecuperarSenhaViewModel", () => {
  it("erro no e-mail fica no campo; enviado mostra a confirmação e volta ao login", async () => {
    const auth = authFalso();
    auth.requestPasswordReset.mockRejectedValueOnce(new ValidationError({ email: "Informe um e-mail válido." }));
    const { result } = await renderHook(() => useRecuperarSenhaViewModel(auth));

    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].emailError).toBe("Informe um e-mail válido."));

    await agir(() => result.current[1].setEmail("l@mail.com"));
    expect(result.current[0].emailError).toBeNull();
    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].sent).toBe(true));
    expect(auth.requestPasswordReset).toHaveBeenLastCalledWith("l@mail.com");

    await agir(() => result.current[1].backToLogin());
    expect(mockDismissTo).toHaveBeenCalledWith("/login");
  });
});

describe("useRedefinirSenhaViewModel", () => {
  it("usa o token do link, mostra o erro do servidor e depois leva ao login", async () => {
    mockParams = { token: "tk-123" };
    const auth = authFalso();
    auth.resetPassword.mockRejectedValueOnce(new DomainError("Token inválido ou expirado.", "INVALID_DATA"));
    const { result } = await renderHook(() => useRedefinirSenhaViewModel(auth));

    await agir(() => result.current[1].setField("newPassword", "novaSenha1"));
    await agir(() => result.current[1].setField("confirmPassword", "novaSenha1"));
    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].errorMessage).toBe("Token inválido ou expirado."));
    expect(auth.resetPassword).toHaveBeenCalledWith("tk-123", { newPassword: "novaSenha1", confirmPassword: "novaSenha1" });

    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].done).toBe(true));
    await agir(() => result.current[1].goLogin());
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
