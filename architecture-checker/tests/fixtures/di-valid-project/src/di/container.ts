import {
    AppointmentUseCases,
    AuthUseCases,
    BarbershopUseCases,
    HomeUseCases,
    OwnerUseCases,
    PortfolioUseCases,
    ProfessionalUseCases,
    ProfileUseCases,
} from "../usecase/useCases";

export const appointmentUseCases = new AppointmentUseCases();
export const authUseCases = new AuthUseCases();
export const barbershopUseCases = new BarbershopUseCases();
export const homeUseCases = new HomeUseCases();
export const ownerUseCases = new OwnerUseCases();
export const portfolioUseCases = new PortfolioUseCases();
export const professionalUseCases = new ProfessionalUseCases();
export const profileUseCases = new ProfileUseCases();
