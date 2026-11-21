export interface IAuthRepository {
    login(email: string, password: string): Promise<void>;
}
