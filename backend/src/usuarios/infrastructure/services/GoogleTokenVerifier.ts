import { OAuth2Client } from 'google-auth-library'
import { GoogleTokenPayload, IVerificadorTokenGoogle } from '../../domain/interfaces/IVerificadorTokenGoogle'
import { AppError } from '../../../shared/errors/AppError'

const CODIGOS_INDISPONIBILIDADE = ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN']

function ehIndisponibilidade(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false

  const { code, message, response } = err as {
    code?: unknown
    message?: unknown
    response?: { status?: unknown }
  }

  if (typeof code === 'string' && CODIGOS_INDISPONIBILIDADE.includes(code)) return true

  if (response && typeof response.status === 'number' && response.status >= 500) return true

  if (typeof message === 'string' && /fetch failed|network|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|timeout/i.test(message)) {
    return true
  }

  return false
}

export class GoogleTokenVerifier implements IVerificadorTokenGoogle {
  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  async verificar(idToken: string): Promise<GoogleTokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()

      if (!payload) {
        throw new AppError(
          'Não foi possível validar a sua conta Google. Tente novamente.',
          401,
          'INVALID_GOOGLE_TOKEN'
        )
      }

      return {
        sub: payload.sub,
        email: payload.email ?? null,
        emailVerified: payload.email_verified ?? false,
        name: payload.name ?? null,
        givenName: payload.given_name ?? null,
        familyName: payload.family_name ?? null,
        picture: payload.picture ?? null,
      }
    } catch (err) {
      if (err instanceof AppError) throw err

      if (ehIndisponibilidade(err)) {
        throw new AppError(
          'Serviço do Google indisponível no momento. Tente novamente em instantes.',
          503,
          'GOOGLE_UNAVAILABLE'
        )
      }

      throw new AppError(
        'Não foi possível validar a sua conta Google. Tente novamente.',
        401,
        'INVALID_GOOGLE_TOKEN'
      )
    }
  }
}
