'use client'

import { useState, useEffect } from 'react'

interface JWTClaims {
    sub: string
    iss: string
    roles: string[]
    exp: number
    iat: number
}

interface JWTStatusProps {
    jwt: string | null
    claims: JWTClaims | null
    isLoading: boolean
    error: string | null
    expiresAt: string | null
    timeUntilExpiration: number
    status: string
    onRefresh: () => void
}

export function JWTStatus({
    jwt,
    claims,
    isLoading,
    error,
    expiresAt,
    timeUntilExpiration,
    status,
    onRefresh,
}: JWTStatusProps) {
    const [countdown, setCountdown] = useState<string>('')

    useEffect(() => {
        const updateCountdown = () => {
            if (timeUntilExpiration <= 0) {
                setCountdown('Expired')
                return
            }

            const hours = Math.floor(timeUntilExpiration / (1000 * 60 * 60))
            const minutes = Math.floor((timeUntilExpiration % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((timeUntilExpiration % (1000 * 60)) / 1000)

            setCountdown(`${hours}h ${minutes}m ${seconds}s`)
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 1000)
        return () => clearInterval(interval)
    }, [timeUntilExpiration])

    const copyToClipboard = async () => {
        if (jwt) {
            try {
                await navigator.clipboard.writeText(jwt)
                alert('JWT copied to clipboard!')
            } catch (err) {
                console.error('Failed to copy JWT:', err)
            }
        }
    }

    const getStatusClass = () => {
        switch (status) {
            case 'valid': return 'jwt-status valid'
            case 'expired': return 'jwt-status expired'
            case 'loading': return 'jwt-status loading'
            default: return 'jwt-status'
        }
    }

    const getStatusText = () => {
        switch (status) {
            case 'valid': return '✅ Valid'
            case 'expired': return '❌ Expired'
            case 'loading': return '⏳ Loading...'
            case 'error': return '❌ Error'
            case 'no-token': return '⚪ No Token'
            default: return '❓ Unknown'
        }
    }

    return (
        <div className="jwt-demo">
            <h3>JWT Authentication Status</h3>

            <div className={getStatusClass()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Status: {getStatusText()}</strong>
                    <div>
                        <button
                            className="button"
                            onClick={onRefresh}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Refreshing...' : 'Refresh JWT'}
                        </button>
                        {jwt && (
                            <button
                                className="button"
                                onClick={copyToClipboard}
                            >
                                Copy JWT
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {expiresAt && (
                    <div style={{ marginTop: '10px' }}>
                        <strong>Expires:</strong> {new Date(expiresAt).toLocaleString()}
                        <br />
                        <strong>Time remaining:</strong> {countdown}
                    </div>
                )}

                {claims && (
                    <div className="jwt-claims">
                        <strong>JWT Claims:</strong>
                        <pre style={{ margin: '5px 0', color: '#333' }}>
                            {JSON.stringify(
                                {
                                    sub: claims.sub,
                                    iss: claims.iss,
                                    roles: claims.roles,
                                    exp: claims.exp,
                                    iat: claims.iat,
                                    'exp (human)': new Date(claims.exp * 1000).toLocaleString(),
                                    'iat (human)': new Date(claims.iat * 1000).toLocaleString(),
                                },
                                null,
                                2
                            )}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
} 