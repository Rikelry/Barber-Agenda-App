/** Foto do portfólio de um profissional (RF novo: portfólio e Inspirações). */
export interface FotoPortfolio {
  id: string
  professionalId: string
  imageUrl: string
  caption: string | null
  serviceId: string | null
  featured: boolean
  createdAt: string
  /** Dados de exibição vindos dos joins. */
  serviceName: string | null
  professionalName: string
  barbershopId: string
}

export interface NovaFotoPortfolio {
  professionalId: string
  imageUrl: string
  caption: string | null
  serviceId: string | null
  featured: boolean
  clientConsent: boolean
}
