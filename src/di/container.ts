// Composição das dependências: único lugar (fora dos testes) que importa @/infra.

import { HttpBarbershopDataSource } from "@/infra/datasources/httpBarbershopDataSource";
import { HttpClient } from "@/infra/http/httpClient";
import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import { BarbershopUseCases } from "@/usecase/barbershopUseCases";

export const authSession = new MemoryAuthSessionService();

const httpClient = new HttpClient(authSession);
const barbershopDataSource = new HttpBarbershopDataSource(httpClient);

export const barbershopUseCases = new BarbershopUseCases(barbershopDataSource);
