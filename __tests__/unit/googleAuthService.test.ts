import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { GoogleAuthService } from "@/infra/services/googleAuthService";

const mockConfigure = jest.fn((..._args: unknown[]) => undefined);
const mockHasPlayServices = jest.fn(async (..._args: unknown[]) => undefined);
const mockSignIn = jest.fn(async (..._args: unknown[]): Promise<unknown> => ({ type: "cancelled" }));

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: (...args: unknown[]) => mockConfigure(...args),
    hasPlayServices: (...args: unknown[]) => mockHasPlayServices(...args),
    signIn: (...args: unknown[]) => mockSignIn(...args),
  },
  isSuccessResponse: (resposta: { type?: string }) => resposta?.type === "success",
  isErrorWithCode: (erro: unknown) => typeof (erro as { code?: unknown })?.code === "number",
  statusCodes: { SIGN_IN_CANCELLED: 12501, IN_PROGRESS: 12502, PLAY_SERVICES_NOT_AVAILABLE: 12500 },
}));

beforeEach(() => {
  mockSignIn.mockReset();
});

describe("GoogleAuthService", () => {
  it("configura o SDK com os Client IDs vindos das variáveis de ambiente", () => {
    new GoogleAuthService();
    expect(mockConfigure).toHaveBeenCalledTimes(1);
    const [opcoes] = mockConfigure.mock.calls[0] as [{ webClientId?: string; iosClientId?: string }];
    expect(opcoes).toHaveProperty("webClientId", process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
    expect(opcoes).toHaveProperty("iosClientId", process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);
  });

  it("devolve o ID token quando o usuário escolhe a conta", async () => {
    mockSignIn.mockResolvedValueOnce({ type: "success", data: { idToken: "id-token" } });
    await expect(new GoogleAuthService().signIn()).resolves.toEqual({ idToken: "id-token" });
  });

  it("trata o cancelamento do seletor de contas", async () => {
    mockSignIn.mockResolvedValueOnce({ type: "cancelled" });
    await expect(new GoogleAuthService().signIn()).rejects.toMatchObject({
      code: "CANCELLED",
      message: "Login com Google cancelado.",
    });
  });

  it("trata a falha de disponibilidade do Google Play Services", async () => {
    mockSignIn.mockRejectedValueOnce({ code: 12500 });
    await expect(new GoogleAuthService().signIn()).rejects.toMatchObject({ code: "INVALID_DATA" });
  });

  it("trata um erro inesperado do SDK", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("boom"));
    await expect(new GoogleAuthService().signIn()).rejects.toMatchObject({ code: "SERVER" });
  });
});
