import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../../services/jwtService'
import { BtAiApiService } from '../../../../services/btAiApiService'

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

    // Call main API using service
    const responseData = await BtAiApiService.verifyPurchaseIntent(jwt, id, body)

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ Purchase intent verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
