import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || '00000000-0000-0000-0000-000000000000'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { action, brand, ...payload } = body

    console.log('🚀 Purchase Intent Verification API Route:', {
      intentId: id,
      action,
      brand,
      hasPayload: !!payload
    })

    // Get JWT from Authorization header or X-JWT-Token header
    const authHeader = request.headers.get('authorization')
    const jwtFromAuth = authHeader?.replace('Bearer ', '')
    const jwtFromHeader = request.headers.get('x-jwt-token')
    const jwt = jwtFromAuth || jwtFromHeader

    if (!jwt) {
      return NextResponse.json(
        { error: 'JWT token is required for verification' },
        { status: 401 }
      )
    }

    // Prepare verification request body based on action
    let verificationBody: any = {
      action: action || 'START'
    }

    // Add action-specific payload
    switch (action) {
      case 'START':
        // Include brand info for initial verification request
        if (brand) {
          verificationBody.brand = brand
        }
        // Include any iframe data or device context
        if (payload.iframeData) {
          verificationBody.iframeData = payload.iframeData
        }
        break
      
      case 'SELECT_OTP':
        if (payload.methodId) {
          verificationBody.payload = { methodId: payload.methodId }
        }
        break
      
      case 'VALIDATE_OTP':
        if (payload.otpCode) {
          verificationBody.payload = { otpCode: payload.otpCode }
        }
        break
      
      case 'AUTHENTICATE_PASSKEY':
        if (payload.assuranceData) {
          verificationBody.payload = { assuranceData: payload.assuranceData }
        }
        break
      
      default:
        // Include any other payload data
        if (Object.keys(payload).length > 0) {
          verificationBody = { ...verificationBody, ...payload }
        }
    }

    console.log('📡 Forwarding to backend:', {
      url: `${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents/${id}/verify`,
      action: verificationBody.action,
      brand,
      bodyKeys: Object.keys(verificationBody)
    })

    // Forward to backend verification endpoint
    const response = await fetch(
      `${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents/${id}/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
          'User-Agent': 'BasisTheory-React-Example/1.0.0'
        },
        body: JSON.stringify(verificationBody)
      }
    )

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Backend verification failed:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      })

      return NextResponse.json(
        { 
          error: responseData.error || 'Verification failed',
          details: responseData,
          status: response.status
        },
        { status: response.status }
      )
    }

    console.log('✅ Verification successful:', {
      status: responseData.status,
      intentId: id,
      hasData: !!responseData.data
    })

    // Handle different verification responses based on brand and status
    const enhancedResponse = {
      ...responseData,
      metadata: {
        brand,
        intentId: id,
        action: verificationBody.action,
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json(enhancedResponse)

  } catch (error) {
    console.error('❌ Verification API route error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error during verification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 