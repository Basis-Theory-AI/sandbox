import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig, decodeJWT } from '../../../../lib/jwt/jwtService'

interface JWTRequest {
    userId?: string
    roles?: string[]
}

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

// GET /api/auth/jwt - Generate JWT with default user
export async function GET() {
    try {
        const config = getJWTConfig()
        const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
        const defaultRoles = process.env.NEXT_PUBLIC_DEFAULT_ROLES?.split(',') || ['public']

        console.log('✅ Default JWT generated successfully')

        const jwt = await generateJWT(defaultUserId, config, defaultRoles)
        const claims = decodeJWT(jwt)

        if (!claims) {
            throw new Error('Failed to decode generated JWT')
        }

        const response: JWTResponse = {
            jwt,
            expiresAt: new Date(claims.exp * 1000).toISOString(),
            claims
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('❌ JWT generation error:', error)
        return NextResponse.json(
            {
                error: 'JWT generation failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// POST /api/auth/jwt - Generate JWT with custom user/roles
export async function POST(request: NextRequest) {
    try {
        const body: JWTRequest = await request.json()
        const config = getJWTConfig()

        const userId = body.userId || process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
        const roles = body.roles || process.env.NEXT_PUBLIC_DEFAULT_ROLES?.split(',') || ['public']

        console.log(`✅ Custom JWT generated for user: ${userId}`)

        const jwt = await generateJWT(userId, config, roles)
        const claims = decodeJWT(jwt)

        if (!claims) {
            throw new Error('Failed to decode generated JWT')
        }

        const response: JWTResponse = {
            jwt,
            expiresAt: new Date(claims.exp * 1000).toISOString(),
            claims
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('❌ JWT generation error:', error)
        return NextResponse.json(
            {
                error: 'JWT generation failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
} 