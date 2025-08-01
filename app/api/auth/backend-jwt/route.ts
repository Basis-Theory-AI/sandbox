import { NextResponse } from 'next/server'
import { generateJWT, getJWTConfig, decodeJWT } from '../../../../lib/jwt/jwtService'

interface JWTResponse {
    jwt: string
    expiresAt: string
    claims: {
        sub: string
        iss: string
        roles: string[]
        exp: number
        iat: number
    }
}

// GET /api/auth/backend-jwt - Get the backend JWT used for API calls
export async function GET() {
    try {
        const config = getJWTConfig()
        const defaultUserId = 'user123'
        const jwt = await generateJWT(defaultUserId, config, ['private'])
        const claims = decodeJWT(jwt)

        if (!claims) {
            throw new Error('Failed to decode generated JWT')
        }

        console.log('✅ Backend JWT fetched for display')

        const response: JWTResponse = {
            jwt,
            expiresAt: new Date(claims.exp * 1000).toISOString(),
            claims
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('❌ Backend JWT fetch error:', error)
        return NextResponse.json(
            {
                error: 'Backend JWT fetch failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
} 