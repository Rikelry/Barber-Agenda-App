import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import { ValidationError } from "@/model/errors";
import { useCadastroViewModel } from "@/viewmodel/useCadastroViewModel";

import { agir, authFalso } from "../helpers/authFalso";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({ router: { replace: (...a: unknown[]) => mockReplace(...a) } }));
jest.mock("@/di/container", () => ({ authUseCases: {}, ownerUseCases: {}, imagePicker: {} }));

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

  it("dono: cria a conta, segue para a barbearia e, ao cadastrá-la, abre a Gestão", async () => {
    const auth = authFalso();
    const owner = {
      createBarbershop: jest.fn(async () => ({ id: "b1", name: "X", address: "", phone: "", avatarUrl: null })),
    } as unknown as Parameters<typeof useCadastroViewModel>[1];
    const { result } = await renderHook(() => useCadastroViewModel(auth, owner));
    expect(result.current[0].step).toBe("tipo");
    await agir(() => result.current[1].setAccountType("dono"));
    expect(result.current[0].totalSteps).toBe(3);
    await agir(() => result.current[1].next());
    expect(result.current[0].step).toBe("dados");
    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].step).toBe("barbearia"));
    expect(mockReplace).not.toHaveBeenCalled();
    await agir(() => result.current[1].setBarbershopField("name", "Barbearia X"));
    await agir(() => result.current[1].submitBarbershop());
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/gestao"));
    expect(auth.refreshSession).toHaveBeenCalled();
  });
});
