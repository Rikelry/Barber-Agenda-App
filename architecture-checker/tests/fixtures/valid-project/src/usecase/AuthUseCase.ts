import type { IAuthRepository } from "../model/IAuthRepository";

export class AuthUseCase {
    constructor(private repository: IAuthRepository) { }

    async execute(email: string, password: string): Promise<void> {
        await this.repository.login(email, password);
    }
}
