export interface GoogleTokenPayload {
  sub: string
  email: string | null
  emailVerified: boolean
  name: string | null
  givenName: string | null
  familyName: string | null
  picture: string | null
}

export interface IVerificadorTokenGoogle {
  verificar(idToken: string): Promise<GoogleTokenPayload>
}
