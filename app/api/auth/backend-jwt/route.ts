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
export const fetchCache = 'force-no-store';
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

        const nextResponse = NextResponse.json(response)
        
        // Prevent caching by Vercel and browsers
        nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        nextResponse.headers.set('Pragma', 'no-cache')
        nextResponse.headers.set('Expires', '0')
        nextResponse.headers.set('Surrogate-Control', 'no-store')
        
        return nextResponse
    } catch (error) {
        console.error('❌ Backend JWT fetch error:', error)
        const errorResponse = NextResponse.json(
            {
                error: 'Backend JWT fetch failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
        
        // Prevent caching error responses too
        errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        errorResponse.headers.set('Pragma', 'no-cache')
        errorResponse.headers.set('Expires', '0')
        errorResponse.headers.set('Surrogate-Control', 'no-store')
        
        return errorResponse
    }
} 