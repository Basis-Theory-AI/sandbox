'use client'

import { useState, useEffect, useCallback } from 'react'

interface JWTClaims {
    sub: string
    iss: string
    roles: string[]
    exp: number
    iat: number
}

interface JWTState {
    jwt: string | null
    claims: JWTClaims | null
    isLoading: boolean
    error: string | null
    expiresAt: string | null
}

interface JWTResponse {
    jwt: string
    expiresAt: string
    claims: JWTClaims
}

export function useJWT() {
    const [state, setState] = useState<JWTState>({
        jwt: null,
        claims: null,
        isLoading: false,
        error: null,
        expiresAt: null,
    })

    const fetchJWT = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const response = await fetch('/api/auth/jwt')

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to fetch JWT')
            }

            const data: JWTResponse = await response.json()

            setState({
                jwt: data.jwt,
                claims: data.claims,
                expiresAt: data.expiresAt,
                isLoading: false,
                error: null,
            })

            // Schedule refresh 5 minutes before expiration
            const expirationTime = new Date(data.expiresAt).getTime()
            const refreshTime = expirationTime - Date.now() - (5 * 60 * 1000) // 5 minutes buffer

            if (refreshTime > 0) {
                setTimeout(() => {
                    fetchJWT()
                }, refreshTime)
            }

        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }))
        }
    }, [])

    const refreshJWT = useCallback(() => {
        return fetchJWT()
    }, [fetchJWT])

    const isExpired = useCallback(() => {
        if (!state.expiresAt) return false
        return new Date(state.expiresAt).getTime() <= Date.now()
    }, [state.expiresAt])

    const getTimeUntilExpiration = useCallback(() => {
        if (!state.expiresAt) return 0
        return Math.max(0, new Date(state.expiresAt).getTime() - Date.now())
    }, [state.expiresAt])

    const getStatus = useCallback(() => {
        if (state.isLoading) return 'loading'
        if (state.error) return 'error'
        if (!state.jwt) return 'no-token'
        if (isExpired()) return 'expired'
        return 'valid'
    }, [state.isLoading, state.error, state.jwt, isExpired])

    useEffect(() => {
        fetchJWT()
    }, [fetchJWT])

    return {
        ...state,
        fetchJWT,
        refreshJWT,
        isExpired: isExpired(),
        timeUntilExpiration: getTimeUntilExpiration(),
        status: getStatus(),
    }
} 