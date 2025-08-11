import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../lib/jwt/jwtService'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const PROJECT_ID = process.env.JWT_PROJECT_ID

// POST - Create Payment Method (requires public role)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardNumber, expirationMonth, expirationYear, cvc, cardBrand } = body

    // Validate required fields
    if (!cardNumber || !expirationMonth || !expirationYear || !cvc) {
      return NextResponse.json(
        { error: 'Missing required fields: cardNumber, expirationMonth, expirationYear, cvc' },
        { status: 400 }
      )
    }

    // Get JWT from Authorization header or generate default with public role
    const authHeader = request.headers.get('Authorization')
    let jwt: string
    const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      jwt = authHeader.substring(7)
    } else {
      // Fallback: generate JWT with public role for payment method creation
      const config = getJWTConfig()
      jwt = await generateJWT(defaultUserId, config, ['public'])
    }

    // Prepare payment method data
    const paymentMethodData = {
      entityId: defaultUserId,
      card: {
        number: cardNumber,
        expirationMonth: expirationMonth.toString().padStart(2, '0'),
        expirationYear: expirationYear.toString(),
        cvc: cvc
      }
    }

    console.log('🚀 Creating payment method:', { 
      cardBrand, 
      last4: cardNumber.slice(-4),
      expirationMonth: paymentMethodData.card.expirationMonth,
      expirationYear: paymentMethodData.card.expirationYear
    })

    // Call main API
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(paymentMethodData)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Payment method creation failed:', responseData)
      return NextResponse.json(
        { error: responseData.error || 'Failed to create payment method' },
        { status: response.status }
      )
    }

    console.log('✅ Payment method created successfully:', {
      id: responseData.id,
      brand: responseData.card?.brand,
      last4: responseData.card?.details?.last4
    })

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ Payment method creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - List Payment Methods (requires private role)
export async function GET(request: NextRequest) {
  try {
    // Get JWT from Authorization header or generate default with private role
    const authHeader = request.headers.get('Authorization')
    let jwt: string
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      jwt = authHeader.substring(7)
    } else {
      // Fallback: generate JWT with private role for fetching payment methods
      const config = getJWTConfig()
      const defaultUserId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'user123'
      jwt = await generateJWT(defaultUserId, config, ['private'])
    }

    console.log('📋 Fetching payment methods for project:', PROJECT_ID)

    // Call main API
    const response = await fetch(`${API_BASE_URL}/projects/${PROJECT_ID}/payment-methods`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Failed to fetch payment methods:', responseData)
      return NextResponse.json(
        { error: responseData.error || 'Failed to fetch payment methods' },
        { status: response.status }
      )
    }

    console.log('✅ Payment methods fetched successfully:', {
      count: responseData.length || 0
    })

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ Payment methods fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 