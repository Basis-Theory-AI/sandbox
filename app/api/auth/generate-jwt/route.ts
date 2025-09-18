import { NextRequest, NextResponse } from 'next/server'
import { generateJWT, getJWTConfig } from '../../../services/jwtService'

interface JWTRequest {
  entityId: string
  role: 'public' | 'private'
}

// POST /api/auth/generate-jwt - Generate JWT for specific user and role
export async function POST(request: NextRequest) {
  try {
    const body: JWTRequest = await request.json()
    const { entityId, role } = body

    if (!entityId) {
      return NextResponse.json(
        { error: 'Entity ID is required' },
        { status: 400 }
      )
    }

    if (!role || !['public', 'private'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either "public" or "private"' },
        { status: 400 }
      )
    }

    const config = getJWTConfig()
    const jwt = await generateJWT(entityId, config, [role])

    return NextResponse.json({ jwt })

  } catch (error) {
    console.error('❌ Failed to generate JWT:', error)
    return NextResponse.json(
      { error: 'Failed to generate JWT' },
      { status: 500 }
    )
  }
}
