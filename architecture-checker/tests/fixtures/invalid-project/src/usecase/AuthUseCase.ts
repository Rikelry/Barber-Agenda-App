import { AuthRepository } from "../infra/AuthRepository";

export class AuthUseCase {
    private repository = new AuthRepository();

    async execute(): Promise<void> {
        await this.repository.login();
    }
}
