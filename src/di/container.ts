// Composição das dependências: único lugar (fora dos testes) que importa @/infra.

import { HttpAppointmentDataSource } from "@/infra/datasources/httpAppointmentDataSource";
import { HttpUserDataSource } from "@/infra/datasources/httpUserDataSource";
import { HttpProfessionalDataSource } from "@/infra/datasources/httpProfessionalDataSource";
import { HttpAuthDataSource } from "@/infra/datasources/httpAuthDataSource";
import { HttpBarbershopDataSource } from "@/infra/datasources/httpBarbershopDataSource";
import { HttpPortfolioDataSource } from "@/infra/datasources/httpPortfolioDataSource";
import { InMemoryHomeDataSource } from "@/infra/datasources/inMemoryHomeDataSource";
import { HttpClient } from "@/infra/http/httpClient";
import { ExpoImagePickerService } from "@/infra/services/expoImagePickerService";
import { GoogleAuthService } from "@/infra/services/googleAuthService";
import { HttpImageStorageService } from "@/infra/services/httpImageStorageService";
import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import { SecureSessionStorageService } from "@/infra/services/secureSessionStorageService";
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
const barbershopDataSource = new HttpBarbershopDataSource(httpClient);

export const barbershopUseCases = new BarbershopUseCases(barbershopDataSource);
export const ownerUseCases = new OwnerUseCases(
  barbershopDataSource,
  new HttpImageStorageService(httpClient),
  authSession,
);
export const imagePicker = new ExpoImagePickerService();
export const portfolioUseCases = new PortfolioUseCases(
  new HttpPortfolioDataSource(httpClient),
  new HttpImageStorageService(httpClient),
);
export const professionalUseCases = new ProfessionalUseCases(
  new HttpProfessionalDataSource(httpClient),
  barbershopDataSource,
  authSession,
);
export const appointmentUseCases = new AppointmentUseCases(
  new HttpAppointmentDataSource(httpClient),
  barbershopDataSource,
);
export const authUseCases = new AuthUseCases(
  new HttpAuthDataSource(httpClient),
  authSession,
  new SecureSessionStorageService(),
  new GoogleAuthService(),
);

export const profileUseCases = new ProfileUseCases(new HttpUserDataSource(httpClient));

// Home: destaques e agendamentos de exemplo em memória.
export const homeUseCases = new HomeUseCases(new InMemoryHomeDataSource());
