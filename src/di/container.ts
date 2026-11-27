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
import { HttpImageStorageService } from "@/infra/services/httpImageStorageService";
import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import { SecureSessionStorageService } from "@/infra/services/secureSessionStorageService";
import { Platform, TurboModuleRegistry } from "react-native";

import { DomainError } from "@/model/errors";
import type { IGoogleAuthService } from "@/model/services/iGoogleAuthService";
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
// O login com Google é um módulo nativo: no Expo Go (ou num build que não o inclua) o
// TurboModule "RNGoogleSignin" não existe e o import derrubaria o app com um erro fatal.
// Carregamos sob demanda e só importamos quando o módulo está de fato disponível; na web o
// serviço resolvido é o do Google Identity Services (googleAuthService.web.ts), que não usa módulo nativo.
const moduloGoogleDisponivel = (): boolean =>
  Platform.OS === "web" || TurboModuleRegistry.get("RNGoogleSignin") != null;

const googleAuthService: IGoogleAuthService = {
  signIn: async () => {
    if (!moduloGoogleDisponivel()) {
      throw new DomainError(
        "O login com Google só funciona no app instalado por um build de desenvolvimento, não no Expo Go.",
        "SERVER",
      );
    }

    const { GoogleAuthService } = await import("@/infra/services/googleAuthService");
    return new GoogleAuthService().signIn();
  },
};

export const authUseCases = new AuthUseCases(
  new HttpAuthDataSource(httpClient),
  authSession,
  new SecureSessionStorageService(),
  googleAuthService,
);

export const profileUseCases = new ProfileUseCases(new HttpUserDataSource(httpClient));

// Home: destaques e agendamentos de exemplo em memória.
export const homeUseCases = new HomeUseCases(new InMemoryHomeDataSource());
