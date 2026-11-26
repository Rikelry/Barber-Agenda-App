import { jest } from "@jest/globals";
import { act } from "@testing-library/react-native";

import type { Session } from "@/model/entities/session";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";

export const SESSAO: Session = {
  token: "jwt",
  user: { id: "u1", name: "Lucas", email: "l@mail.com", phone: "11999999999", avatarUrl: null, memberSince: new Date() },
  roles: ["cliente"],
};

/** AuthUseCases falso: tudo dá certo, a não ser que o teste mude o mock. */
export const authFalso = (): jest.Mocked<IAuthUseCases> => ({
  getSession: jest.fn(() => null),
  restoreSession: jest.fn(async () => null),
  login: jest.fn(async () => SESSAO),
  loginWithGoogle: jest.fn(async () => SESSAO),
  register: jest.fn(async () => SESSAO),
  requestPasswordReset: jest.fn(async () => undefined),
  resetPassword: jest.fn(async () => undefined),
  logout: jest.fn(),
  refreshSession: jest.fn(async () => SESSAO),
});

/** Executa uma ação da ViewModel dentro de act (a v14 da Testing Library exige await). */
export const agir = (f: () => void) =>
  act(async () => {
    f();
  });
