import { AuthRepository } from "../infra/AuthRepository";
import { AuthUseCase } from "../usecase/AuthUseCase";

const authRepository = new AuthRepository();

export const authUseCase = new AuthUseCase(authRepository);
