// Composição das dependências: único lugar (fora dos testes) que importa @/infra.

import { HttpBarbershopDataSource } from "@/infra/datasources/httpBarbershopDataSource";
import { InMemoryUserDataSource } from "@/infra/datasources/inMemoryUserDataSource";
import { HttpClient } from "@/infra/http/httpClient";
import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import { BarbershopUseCases } from "@/usecase/barbershopUseCases";
import { ProfileUseCases } from "@/usecase/profileUseCases";

export const authSession = new MemoryAuthSessionService();

const httpClient = new HttpClient(authSession);
const barbershopDataSource = new HttpBarbershopDataSource(httpClient);

export const barbershopUseCases = new BarbershopUseCases(barbershopDataSource);

// Perfil: usuário de exemplo em memória até a tela de login existir.
export const profileUseCases = new ProfileUseCases(new InMemoryUserDataSource());
