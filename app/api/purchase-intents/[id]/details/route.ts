import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../../../lib/jwt/jwtService'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const PROJECT_ID = process.env.JWT_PROJECT_ID

// GET - Fetch Purchase Intent Details with Card Info
export async function GET(
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
      // Fallback: generate JWT with private role for fetching purchase intent details
      const config = getJWTConfig()
      const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
      jwt = await generateJWT(defaultUserId, config, ['private'])
    }

    console.log('🔍 Fetching purchase intent details for:', id)

    // Call main API
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Failed to fetch purchase intent details:', responseData)
      return NextResponse.json(
        { error: responseData.error || 'Failed to fetch purchase intent details' },
        { status: response.status }
      )
    }

    console.log('✅ Purchase intent details fetched successfully:', {
      id: responseData.id,
      status: responseData.status,
      hasCard: !!responseData.card
    })

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ Purchase intent details fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 