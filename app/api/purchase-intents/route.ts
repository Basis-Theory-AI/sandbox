import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../lib/jwt/jwtService'
import https from 'https'
import { URL } from 'url'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const PROJECT_ID = process.env.JWT_PROJECT_ID

// Helper function to make HTTPS requests without undici issues
function makeHttpsRequest(url: string, options: {
  method: string
  headers: Record<string, string>
  body: Buffer
}): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method,
      headers: options.headers
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : require('http')

    const req = protocol.request(requestOptions, (res: any) => {
      let data = ''

      res.on('data', (chunk: any) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {}
          resolve({
            status: res.statusCode,
            data: jsonData
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: { error: 'Invalid JSON response', raw: data }
          })
        }
      })
    })

    req.on('error', (error: any) => {
      reject(error)
    })

    if (options.body) {
      req.write(options.body)
    }

    req.end()
  })
}

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
    value: "1735690745"
  },
  {
    type: "prompt",
    value: "The purchase of electronics under US$500 at Apple Store by the end of the day"
  },
  {
    type: "consumer",
    value: "3d50aca6-9d1e-4459-8254-4171a92f5bd0",
    details: {
      email: "lucas@basistheory.com"
    }
  }
]

// POST - Create Purchase Intent (requires private role)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentMethodId, entityId, credentialType, mandates } = body

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
      defaultUserId = entityId || 'user123'
    } else {
      // Fallback: generate JWT with private role for purchase intent creation
      const config = getJWTConfig()
      defaultUserId = entityId || 'user123'
      jwt = await generateJWT(defaultUserId, config, ['private'])
    }

    // Prepare purchase intent data - use mandates from request or fallback to defaults
    const purchaseIntentData = {
      entityId: defaultUserId,
      paymentMethodId: paymentMethodId,
      credentialType: credentialType || "virtual-card",
      mandates: mandates || DEFAULT_MANDATES
    }

    console.log('🚀 Creating purchase intent:', {
      paymentMethodId: paymentMethodId.slice(-8),
      entityId: defaultUserId,
      credentialType: purchaseIntentData.credentialType,
      mandatesCount: purchaseIntentData.mandates.length
    })

    // Validate environment variables
    if (!API_BASE_URL || !PROJECT_ID) {
      throw new Error(`Missing environment variables: API_BASE_URL=${API_BASE_URL}, PROJECT_ID=${PROJECT_ID}`)
    }

    // Call main API
    const requestBodyString = JSON.stringify(purchaseIntentData)
    const requestBody = Buffer.from(requestBodyString, 'utf8')
    let requestUrl = `${API_BASE_URL}/projects/${PROJECT_ID}/purchase-intents`

    console.log('📤 Request body string length:', requestBodyString.length)
    console.log('📤 Request body buffer length:', requestBody.length)
    console.log('📤 Request URL:', requestUrl)

    // Check if we need to use HTTPS instead of HTTP
    if (requestUrl.startsWith('http://api.sandbox.basistheory.ai')) {
      const httpsUrl = requestUrl.replace('http://', 'https://')
      console.log('🔄 Switching to HTTPS URL:', httpsUrl)
      requestUrl = httpsUrl
    }
    console.log('📤 Request body preview:', requestBodyString.substring(0, 200) + '...')

    // Try a different approach to avoid undici Content-Length bug
    // Use fetch with explicit Content-Length and additional headers
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
        'Accept': 'application/json',
        'User-Agent': 'NextJS-BasisTheory/1.0'
      },
      body: requestBodyString, // Use string instead of Buffer
      redirect: 'follow' // Follow redirects automatically
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Purchase intent creation failed:', JSON.stringify(responseData, null, 2))

      // Log detailed validation errors if available
      if (responseData.error?.details?.fields) {
        console.error('🔍 Validation field errors:', JSON.stringify(responseData.error.details.fields, null, 2))
      }

      return NextResponse.json(
        { error: responseData.error || 'Failed to create purchase intent' },
        { status: response.status }
      )
    }

    // Debug the actual response structure
    console.log('📋 Full response data:', JSON.stringify(responseData, null, 2))

    console.log('✅ Purchase intent created successfully:', {
      id: responseData.id,
      status: responseData.status,
      paymentMethodId: paymentMethodId.slice(-8)
    })

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('❌ Purchase intent creation error:', error)

    // Log additional error details for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      if ('cause' in error) {
        console.error('Error cause:', error.cause)
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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