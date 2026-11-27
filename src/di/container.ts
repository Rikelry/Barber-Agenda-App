// Composição das dependências: único lugar (fora dos testes) que importa @/infra.

import {
  DemoAgendaDataSource,
  DemoAppointmentDataSource,
  DemoAuthDataSource,
  DemoBarbershopDataSource,
  DemoPortfolioDataSource,
  DemoProfessionalDataSource,
  DemoUserDataSource,
} from "@/infra/datasources/demoDataSources";
import { HttpAgendaDataSource } from "@/infra/datasources/httpAgendaDataSource";
import { HttpAppointmentDataSource } from "@/infra/datasources/httpAppointmentDataSource";
import { HttpUserDataSource } from "@/infra/datasources/httpUserDataSource";
import { HttpProfessionalDataSource } from "@/infra/datasources/httpProfessionalDataSource";
import { HttpAuthDataSource } from "@/infra/datasources/httpAuthDataSource";
import { HttpBarbershopDataSource } from "@/infra/datasources/httpBarbershopDataSource";
import { HttpPortfolioDataSource } from "@/infra/datasources/httpPortfolioDataSource";
import { HttpClient } from "@/infra/http/httpClient";
import { ExpoImagePickerService } from "@/infra/services/expoImagePickerService";
import { HttpImageStorageService } from "@/infra/services/httpImageStorageService";
import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import { SecureSessionStorageService } from "@/infra/services/secureSessionStorageService";
import { AgendaUseCases } from "@/usecase/agendaUseCases";
import { AppointmentUseCases } from "@/usecase/appointmentUseCases";
import { AuthUseCases } from "@/usecase/authUseCases";
import { BarbershopUseCases } from "@/usecase/barbershopUseCases";
import { HomeUseCases } from "@/usecase/homeUseCases";
import { OwnerUseCases } from "@/usecase/ownerUseCases";
import { PortfolioUseCases } from "@/usecase/portfolioUseCases";
import { ProfessionalUseCases } from "@/usecase/professionalUseCases";
import { ProfileUseCases } from "@/usecase/profileUseCases";

export const authSession = new MemoryAuthSessionService();

const httpClient = new HttpClient(authSession);

/**
 * Modo demonstração: com EXPO_PUBLIC_USE_MOCK=1 o app usa dados de exemplo em memória (só
 * leitura) no lugar da API, para ver as telas sem backend. Sem a variável, tudo vem da API.
 */
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === "1";

const barbershopDataSource = USE_MOCK ? new DemoBarbershopDataSource() : new HttpBarbershopDataSource(httpClient);

export const barbershopUseCases = new BarbershopUseCases(barbershopDataSource);
export const ownerUseCases = new OwnerUseCases(
  barbershopDataSource,
  new HttpImageStorageService(httpClient),
  authSession,
);
export const imagePicker = new ExpoImagePickerService();
export const portfolioUseCases = new PortfolioUseCases(
  USE_MOCK ? new DemoPortfolioDataSource() : new HttpPortfolioDataSource(httpClient),
  new HttpImageStorageService(httpClient),
);
const professionalDataSource = USE_MOCK ? new DemoProfessionalDataSource() : new HttpProfessionalDataSource(httpClient);

export const professionalUseCases = new ProfessionalUseCases(professionalDataSource, barbershopDataSource, authSession);

// Agendas do barbeiro e da barbearia (dono): pedidos para aprovar/recusar e remarcar.
export const agendaUseCases = new AgendaUseCases(
  USE_MOCK ? new DemoAgendaDataSource() : new HttpAgendaDataSource(httpClient),
  barbershopDataSource,
  professionalDataSource,
);
export const appointmentUseCases = new AppointmentUseCases(
  USE_MOCK ? new DemoAppointmentDataSource() : new HttpAppointmentDataSource(httpClient),
  barbershopDataSource,
);
export const authUseCases = new AuthUseCases(
  USE_MOCK ? new DemoAuthDataSource() : new HttpAuthDataSource(httpClient),
  authSession,
  new SecureSessionStorageService(),
);

export const profileUseCases = new ProfileUseCases(
  USE_MOCK ? new DemoUserDataSource() : new HttpUserDataSource(httpClient),
);

// Home: destaques montados com as barbearias, serviços e horários da API.
export const homeUseCases = new HomeUseCases(barbershopDataSource);
