import { AuthViewModel } from "../viewmodel/AuthViewModel";

export class AuthView {
    constructor(private viewModel: AuthViewModel) { }

    async submit(email: string, password: string): Promise<void> {
        await this.viewModel.login(email, password);
    }
}
