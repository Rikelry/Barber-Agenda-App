import type { IAuthRepository } from "../model/IAuthRepository";

export class AuthRepository implements IAuthRepository {
    async login(email: string, password: string): Promise<void> {
        console.log(email, password);
    }
}
