import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import { ValidationError } from "@/model/errors";
import { useCadastroViewModel } from "@/viewmodel/useCadastroViewModel";

import { agir, authFalso } from "../helpers/authFalso";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({ router: { replace: (...a: unknown[]) => mockReplace(...a) } }));
jest.mock("@/di/container", () => ({ authUseCases: {} }));

beforeEach(() => {
  mockReplace.mockClear();
});

describe("useCadastroViewModel", () => {
  it("mostra os erros por campo e, com a conta criada, vai para a Home", async () => {
    const auth = authFalso();
    auth.register.mockRejectedValueOnce(new ValidationError({ email: "E-mail já cadastrado." }));
    const { result } = await renderHook(() => useCadastroViewModel(auth));

    await agir(() => result.current[1].setField("email", "l@mail.com"));
    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].fieldErrors.email).toBe("E-mail já cadastrado."));
    expect(mockReplace).not.toHaveBeenCalled();

    await agir(() => result.current[1].submit());
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
    expect(auth.register).toHaveBeenLastCalledWith(expect.objectContaining({ email: "l@mail.com" }));
  });
});
