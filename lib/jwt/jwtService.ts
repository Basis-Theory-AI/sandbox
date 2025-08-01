import { SignJWT, jwtVerify, importPKCS8 } from 'jose'

export interface JWTConfig {
    projectId: string
    keyId: string
    secret: string // RSA private key in PKCS8 format for RS256 signing
}

export interface JWTClaims {
    sub: string // user ID
    iss: string // project ID
    roles: string[]
    exp: number
    iat: number
}

/**
 * Generate a new JWT with the specified claims using RS256 (asymmetric key)
 */
export async function generateJWT(
    userId: string,
    config: JWTConfig,
    roles: string[] = ['private']
): Promise<string> {
    try {
        // Use private key for RS256 signing
        const privateKey = await importPKCS8(config.secret, 'RS256')

        const jwt = await new SignJWT({
            sub: userId,
            iss: config.projectId,
            roles: roles,
        })
            .setProtectedHeader({ alg: 'RS256', kid: config.keyId })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(privateKey)

        return jwt
    } catch (error) {
        throw new Error(`JWT generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

/**
 * Verify a JWT signature and expiration using HS256
 */
export async function verifyJWT(jwt: string, config: JWTConfig): Promise<JWTClaims> {
    try {
        const secret = new TextEncoder().encode(config.secret)
        const { payload } = await jwtVerify(jwt, secret)
        return payload as unknown as JWTClaims
    } catch (error) {
        throw new Error(`JWT verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

/**
 * Decode JWT claims without verification (for display purposes)
 */
export function decodeJWT(jwt: string): JWTClaims | null {
    try {
        const parts = jwt.split('.')
        if (parts.length !== 3) return null

        const payload = JSON.parse(atob(parts[1]))
        return payload as JWTClaims
    } catch {
        return null
    }
}

/**
 * Validate JWT configuration
 */
export function validateJWTConfig(config: Partial<JWTConfig>): JWTConfig {
    const { projectId, keyId, secret } = config

    if (!projectId) {
        throw new Error('JWT_PROJECT_ID environment variable is required')
    }

    if (!keyId) {
        throw new Error('JWT_KEY_ID environment variable is required')
    }

    if (!secret) {
        throw new Error('JWT_PRIVATE_KEY environment variable is required')
    }

    return { projectId, keyId, secret }
}

/**
 * Get JWT configuration from environment variables
 */
export function getJWTConfig(): JWTConfig {
    return validateJWTConfig({
        projectId: process.env.JWT_PROJECT_ID,
        keyId: process.env.JWT_KEY_ID,
        secret: process.env.JWT_PRIVATE_KEY, // Use private key for RS256
    })
} 