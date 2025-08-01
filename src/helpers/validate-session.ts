import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'

interface MsalJwtPayload extends jwt.JwtPayload {
  oid: string
  unique_name?: string
  given_name?: string
}

const client = new JwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.MSAL_TENANT_ID}/discovery/keys`,
  cache: true,
  cacheMaxAge: 24 * 60 * 60 * 1000,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
})

console.log('MSAL_TENANT_ID:', process.env.MSAL_TENANT_ID)
console.log(
  'JWKS URI:',
  `https://login.microsoftonline.com/${process.env.MSAL_TENANT_ID}/discovery/keys`,
)

const getKey = async (kid: string): Promise<string> => {
  try {
    const key = await client.getSigningKey(kid)
    const publicKey = key.getPublicKey()
    console.log('Public Key:', publicKey.slice(0, 50) + '...')
    return publicKey
  } catch (err) {
    console.error('Key Fetch Error:', (err as Error).message)
    throw err
  }
}

export const validateMsalJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    console.log('Auth Header:', authHeader)
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Token faltante.' })
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Formato de token inválido.' })
    }

    const token = authHeader.replace(/^Bearer\s+/, '')
    console.log('Token:', token.slice(0, 20) + '...')

    const decoded = jwt.decode(token, { complete: true })
    console.log('Decoded Header:', decoded?.header)
    if (!decoded || !decoded.header.kid) {
      return res.status(401).json({ success: false, message: 'Token inválido.' })
    }

    const signingKey = await getKey(decoded.header.kid)
    const payload = jwt.verify(token, signingKey, {
      issuer: `https://sts.windows.net/${process.env.MSAL_TENANT_ID}/`,
      audience: '00000003-0000-0000-c000-000000000000',
      algorithms: ['RS256'],
    }) as MsalJwtPayload
    console.log('Verified Payload:', payload)

    const email = payload.unique_name
    if (!email) {
      return res.status(401).json({ success: false, message: 'Token sin email.' })
    }

    const studentEmailRegex = /-[0-9]{7}/
    if (studentEmailRegex.test(email)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Solo profesores pueden acceder.',
      })
    }

    req.user = { id: payload.oid, email, name: payload.given_name }
    console.log('User:', req.user)
    next()
    return
  } catch (err) {
    console.error('Validation Error:', (err as Error).message)
    return res.status(500).json({
      success: false,
      message: 'No se pudo validar el token.',
      error: (err as Error).message,
    })
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; name?: string }
    }
  }
}
