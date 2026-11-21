import { authUseCase } from "../di/container";

export class AuthViewModel {
    async login(email: string, password: string): Promise<void> {
        await authUseCase.execute(email, password);
    }
}
