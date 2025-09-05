import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../lib/jwt/jwtService'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const PROJECT_ID = process.env.JWT_PROJECT_ID

// Default mandates configuration
const DEFAULT_MANDATES = [
  {
    type: "maxAmount",
    value: "500",
    details: {
      currency: "840"
    }
  },
  {
    type: "merchant",
    value: "Apple Store",
    details: {
      category: "electronics",
      categoryCode: "5732"
    }
  },
  {
    type: "description",
    value: "Purchase of AirPods Pro and iPhone case"
  },
  {
    type: "expirationTime",
    value: "1767182340"
  },
  {
    type: "prompt",
    value: "The purchase of electronics under US$500 at Apple Store by the end of the day"
  },
  {
    type: "consumer",
    value: "3d50aca6-9d1e-4459-8254-4171a92f5bd0",
    details: {
      name: "Lucas Chociay",
      email: "lucas@basistheory.com",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B", 
        line3: "Building 7",
        city: "Beverly Hills",
        postalCode: "90210",
        stateCode: "CA",
        countryCode: "USA"
      }
    }
  }
]

// POST - Create Purchase Intent (requires private role)
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

    // Get JWT from Authorization header or generate default with private role
    const authHeader = request.headers.get('Authorization')
    let jwt: string
    let defaultUserId: string
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      jwt = authHeader.substring(7)
      defaultUserId = entityId || process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
    } else {
      // Fallback: generate JWT with private role for purchase intent creation
      const config = getJWTConfig()
      defaultUserId = entityId || process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
      jwt = await generateJWT(defaultUserId, config, ['private'])
    }

    // First, fetch payment method details to determine credential type
    console.log('📋 Fetching payment method details:', paymentMethodId.slice(-8))
    
    const paymentMethodResponse = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/payment-methods/${paymentMethodId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })

    if (!paymentMethodResponse.ok) {
      const errorData = await paymentMethodResponse.json()
      console.error('❌ Failed to fetch payment method:', errorData)
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch payment method details' },
        { status: paymentMethodResponse.status }
      )
    }

    const paymentMethodData = await paymentMethodResponse.json()
    
    // Determine credential type based on card brand
    // AMEX and Discover use network-token, Visa and Mastercard use virtual-card
    const cardBrand = paymentMethodData.card?.brand?.toLowerCase()
    const credentialType = (cardBrand === 'amex' || cardBrand === 'american-express' || cardBrand === 'discover') 
      ? 'network-token' 
      : 'virtual-card'

    // Prepare purchase intent data with default mandates
    const purchaseIntentData = {
      entityId: defaultUserId,
      paymentMethodId: paymentMethodId,
      credentialType,
      mandates: DEFAULT_MANDATES
    }

    console.log('🚀 Creating purchase intent:', { 
      paymentMethodId: paymentMethodId.slice(-8),
      entityId: defaultUserId,
      cardBrand,
      credentialType,
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
      console.error('❌ Purchase intent creation failed:', JSON.stringify(responseData, null, 2))
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

// GET - List Purchase Intents (requires private role)
export async function GET(request: NextRequest) {
  try {
    // Get JWT from Authorization header or generate default with private role
    const authHeader = request.headers.get('Authorization')
    let jwt: string
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      jwt = authHeader.substring(7)
    } else {
      // Fallback: generate JWT with private role for fetching purchase intents
      const config = getJWTConfig()
      const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
      jwt = await generateJWT(defaultUserId, config, ['private'])
    }

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