import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../../../lib/jwt/jwtService'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const PROJECT_ID = process.env.JWT_PROJECT_ID

// POST - Verify Purchase Intent
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        if (!id) {
            return NextResponse.json(
                { error: 'Purchase intent ID is required' },
                { status: 400 }
            )
        }

        // Get JWT from Authorization header or generate default with private role
        const authHeader = request.headers.get('Authorization')
        let jwt: string

        if (authHeader && authHeader.startsWith('Bearer ')) {
            jwt = authHeader.substring(7)
        } else {
            // Fallback: generate JWT with private role for verification
            const config = getJWTConfig()
            const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
            jwt = await generateJWT(defaultUserId, config, ['private'])
        }

        // Get request body for verification data
        const body = await request.json()

        console.log('🔍 Verifying purchase intent:', id)

        // Call main API for verification
        const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents/${id}/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const responseData = await response.json()

        if (!response.ok) {
            console.error('❌ Failed to verify purchase intent:', responseData)
            return NextResponse.json(
                { error: responseData.error || 'Failed to verify purchase intent' },
                { status: response.status }
            )
        }

        console.log('✅ Purchase intent verified successfully:', {
            id: responseData.id,
            status: responseData.status
        })

        return NextResponse.json(responseData)

    } catch (error) {
        console.error('❌ Purchase intent verification error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
