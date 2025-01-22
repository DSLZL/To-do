import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.SECRET_KEY!)

export const createSession = () => 
  new SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)

export const verifySession = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret)
    return !!payload.isAdmin
  } catch {
    return false
  }
}