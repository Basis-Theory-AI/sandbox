import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../lib/jwt/jwtService'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const PROJECT_ID = process.env.JWT_PROJECT_ID

// Default mandates configuration
const DEFAULT_MANDATES = [
  {
    type: "maxAmount",
    value: "500.00",
    details: {
      currency: "840", // USD
      period: "monthly"
    }
  },
  {
    type: "merchantMcc",
    value: "5999", // Miscellaneous retail stores
    details: {
      allowed: true,
      description: "Miscellaneous retail stores"
    }
  },
  {
    type: "expirationTime",
    value: "2025-12-31T23:59:59Z",
    details: {
      timezone: "UTC",
      autoRenew: false
    }
  }
]

// POST - Create Purchase Intent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentMethodId, entityId } = body

    // Validate required fields
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing required field: paymentMethodId' },
        { status: 400 }
      )
    }

    // Generate JWT for API authentication
    const config = getJWTConfig()
    const defaultUserId = entityId || 'user123'
    const jwt = await generateJWT(defaultUserId, config, ['private'])

    // Prepare purchase intent data with default mandates
    const purchaseIntentData = {
      entityId: defaultUserId,
      paymentMethodId: paymentMethodId,
      credentialType: "virtual-card",
      mandates: DEFAULT_MANDATES
    }

    console.log('🚀 Creating purchase intent:', { 
      paymentMethodId: paymentMethodId.slice(-8),
      entityId: defaultUserId,
      mandatesCount: DEFAULT_MANDATES.length
    })

    // Call main API
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(purchaseIntentData)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Purchase intent creation failed:', responseData)
      return NextResponse.json(
        { error: responseData.error || 'Failed to create purchase intent' },
        { status: response.status }
      )
    }

    console.log('✅ Purchase intent created successfully:', {
      id: responseData.id,
      status: responseData.status,
      paymentMethodId: paymentMethodId.slice(-8)
    })

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ Purchase intent creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - List Purchase Intents
export async function GET() {
  try {
    // Generate JWT for API authentication
    const config = getJWTConfig()
    const defaultUserId = 'user123'
    const jwt = await generateJWT(defaultUserId, config, ['private'])

    console.log('📋 Fetching purchase intents for project:', PROJECT_ID)

    // Call main API
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Failed to fetch purchase intents:', responseData)
      return NextResponse.json(
        { error: responseData.error || 'Failed to fetch purchase intents' },
        { status: response.status }
      )
    }

    console.log('✅ Purchase intents fetched successfully:', {
      count: responseData.length || 0
    })

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ Purchase intents fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 