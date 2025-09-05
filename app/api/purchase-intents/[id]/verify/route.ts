import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../../../lib/jwt/jwtService'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const PROJECT_ID = process.env.JWT_PROJECT_ID

// POST - Verify Purchase Intent (proxy to main API)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Purchase intent ID is required' },
        { status: 400 }
      )
    }

    // Get JWT from Authorization header or generate default with public role
    const authHeader = request.headers.get('Authorization')
    let jwt: string
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      jwt = authHeader.substring(7)
    } else {
      // Fallback: generate JWT with public role for verification
      const config = getJWTConfig()
      const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
      jwt = await generateJWT(defaultUserId, config, ['public'])
    }

    console.log('🔐 Verifying purchase intent:', {
      id,
      action: body.action,
      hasIframeData: !!body.iframeData,
      hasPayload: !!body.payload
    })

    // Proxy to main API server
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents/${id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(body)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Purchase intent verification failed:', responseData)
      return NextResponse.json(
        { error: responseData.error || 'Failed to verify purchase intent' },
        { status: response.status }
      )
    }

    console.log('✅ Purchase intent verification successful:', {
      id,
      status: responseData.status || 'unknown'
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
