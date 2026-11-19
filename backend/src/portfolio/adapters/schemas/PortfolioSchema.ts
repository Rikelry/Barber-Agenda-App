import { z } from 'zod'

export const adicionarFotoSchema = z.object({
  imageUrl: z.string().url('Envie a foto antes de publicar.'),
  caption: z.string().max(120, 'Legenda com no máximo 120 caracteres.').optional().nullable(),
  serviceId: z.string().uuid().optional().nullable(),
  featured: z.boolean().optional(),
  clientConsent: z.boolean(),
})
