import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import { DomainError, ValidationError } from "@/model/errors";
import { useLoginViewModel } from "@/viewmodel/useLoginViewModel";

import { agir, authFalso } from "../helpers/authFalso";

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams: Record<string, string> = {};
jest.mock("expo-router", () => ({
  router: { push: (...a: unknown[]) => mockPush(...a), replace: (...a: unknown[]) => mockReplace(...a) },
  useLocalSearchParams: () => mockParams,
}));
jest.mock("@/di/container", () => ({ authUseCases: {} }));

beforeEach(() => {
  mockPush.mockClear();
  mockReplace.mockClear();
  mockParams = {};
});

describe("useLoginViewModel", () => {
  it("mostra erro por campo e erro de credenciais; ao entrar vai para a Home", async () => {
    const auth = authFalso();
    auth.login
      .mockRejectedValueOnce(new ValidationError({ email: "Informe um e-mail válido." }))
      .mockRejectedValueOnce(new DomainError("E-mail ou senha inválidos.", "UNAUTHORIZED"));
    const { result } = await renderHook(() => useLoginViewModel(auth));

    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].fieldErrors.email).toBe("Informe um e-mail válido."));
    await agir(() => result.current[1].setField("email", "l@mail.com"));
    expect(result.current[0].fieldErrors.email).toBeUndefined();

    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].errorMessage).toBe("E-mail ou senha inválidos."));

    await agir(() => result.current[1].submit());
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
    expect(auth.login).toHaveBeenLastCalledWith({ email: "l@mail.com", password: "" });
  });

  it("links levam para recuperar senha e criar conta", async () => {
    const { result } = await renderHook(() => useLoginViewModel(authFalso()));
    await agir(() => result.current[1].goRecoverPassword());
    await agir(() => result.current[1].goRegister());
    expect(mockPush.mock.calls).toEqual([["/recuperar-senha"], ["/cadastro"]]);
  });
});
